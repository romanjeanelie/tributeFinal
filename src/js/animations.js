import * as THREE from "three";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import TextIntro from "./textIntro";
import TextGod from "./textGod";
import TextPoint from "./textPoint";
import TextFinal from "./textFinal";
import Circle from "./circle";
import SinglePoint from "./singlePoint";
import Sky from "./sky";
import Plane from "./plane";
import Moon from "./moon/moon";
import Road from "./street/road";
import Planet from "./planet";
import Buttons from "./buttons";
import Flower from "./flower";

import CreatePath from "./camera/createPath";

import ios from "./utils/ios";
import debounce from "./utils/debounce";
import { checkScrollSpeed } from "./utils/checkScrollSpeed";
import once from "./utils/once";

import Help from "./domElements/help";
import TextLight from "./textLight";

export default class Animations {
  constructor(options) {
    let start = 0;
    this.time = start;
    this.timeText = start;

    this.scene = options.scene;
    this.finalScene = options.finalScene;
    this.gui = options.gui;
    this.camera = options.camera;
    this.container = options.container;
    this.renderer = options.renderer;
    this.controls = options.controls;
    this.sizes = options.sizes;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.currentIntersect = null;
    this.intersects = null;

    this.scrollValue = 0;
    this.scrollSpeed = 0;
    this.scrollSpeedEased = { value: 0 };
    this.progress2 = 0;

    this.steps = [1.4];
    this.delta = 0;
    this.currentScroll = 0;

    gsap.registerPlugin(SplitText);

    // DEBUG MODE /////////////////////////////////////////////////////////////////////////////////
    this.backstage = false;
    this.positionTimeline = 2;
    this.start = 0;
    // DEBUG MODE /////////////////////////////////////////////////////////////////////////////////

    this.help = new Help();
    this.scrollActive = false;

    this.destroyAll = once(function () {
      this.planet.planetMaterial.uniforms.opacity.value = 0;
      setTimeout(() => {
        console.log("remove moon");
        this.moon.moonMaterial.uniforms.opacity.value = 0;
      }, 1000);
      setTimeout(() => {
        console.log("remove city");
        this.road.city.opacity = 0;
      }, 2000);
    });

    this.upCityLights = once(() => {
      gsap.to(this.road.cityLights.pointsMaterialBig.uniforms.move, {
        duration: 4,
        value: 1,
      });
    });

    this.init();
  }

  init() {
    this.manageCamera();
    this.addObject();
    this.createTimelines();
    this.getScroll();
    this.getScrollSpeed();
    this.objectsToTest = [this.singlePoint.mesh];
    this.anim();
    this.render();

    this.helpListener();
    this.startListener();

    // START DIRECTLY //////////////////////////////////////////////////////////////////////////////
    // this.startProject();
    // document.querySelector(".home").style.display = "none";
    // START DIRECTLY //////////////////////////////////////////////////////////////////////////////

    if (this.backstage) {
      document.querySelector(".home").style.display = "none";
    }
  }

  startListener() {
    const startBtn = document.getElementById("start");

    const titleSplit = new SplitText(".home__title h1", { type: "words,chars" });

    let indexTitle1 = Math.round(titleSplit.chars.length / 2);
    let indexTitle2 = Math.round(titleSplit.chars.length / 2);

    let charTitle = titleSplit.chars[indexTitle1];

    this.tlTitle = gsap.timeline({ delay: 1 });

    this.tlTitle.from(charTitle, {
      opacity: 0,
      color: "#F41B0C",

      duration: 3,
    });
    for (let i = 0; i < titleSplit.chars.length; i++) {
      indexTitle1 += 1;
      if (titleSplit.chars[indexTitle1]) {
        let charTitle = titleSplit.chars[indexTitle1];
        this.tlTitle.from(
          charTitle,
          {
            delay: i * 0.002,
            opacity: 0,
            color: "#F41B0C",
            duration: 3,
          },
          "<"
        );
      }
      indexTitle2 -= 1;
      if (titleSplit.chars[indexTitle2]) {
        let charTitle = titleSplit.chars[indexTitle2];
        this.tlTitle.from(
          charTitle,
          {
            delay: i * 0.002,
            opacity: 0,
            color: "#F41B0C",
            duration: 3,
          },
          "<"
        );
      }
    }

    const btnSplit = new SplitText(".home__start p", { type: "chars" });

    let indexBtn1 = Math.round(btnSplit.chars.length / 2);
    let indexBtn2 = Math.round(btnSplit.chars.length / 2);

    let charBtn = btnSplit.chars[indexBtn1];

    this.tlBtn = gsap.timeline({ delay: 1 });

    this.tlBtn.from(charBtn, {
      opacity: 0,
      color: "#F41B0C",
      duration: 4,
    });
    for (let i = 0; i < btnSplit.chars.length; i++) {
      indexBtn1 += 1;
      if (btnSplit.chars[indexBtn1]) {
        let charBtn = btnSplit.chars[indexBtn1];
        this.tlBtn.from(
          charBtn,
          {
            delay: i * 0.1,
            opacity: 0,
            color: "#F41B0C",
            duration: 4,
          },
          "<"
        );
      }
      indexBtn2 -= 1;
      if (btnSplit.chars[indexBtn2]) {
        let charBtn = btnSplit.chars[indexBtn2];
        this.tlBtn.from(
          charBtn,
          {
            delay: i * 0.1,
            opacity: 0,
            color: "#F41B0C",
            duration: 4,
          },
          "<"
        );
      }
    }

    startBtn.addEventListener("click", () => {
      this.startProject();
    });
  }

  startProject() {
    const tl = gsap.timeline();

    this.tlTitle.ease = "linear";
    this.tlTitle.reverse();

    tl.to(
      "#start p",
      {
        autoAlpha: 0,
        duration: 1,
      },
      "<"
    );

    tl.fromTo(
      this.singlePoint.material.uniforms.opacity,
      {
        value: 0,
      },
      {
        value: 1,
        delay: 3,
        duration: 6,
        ease: "power2.in",
        onStart: () => {
          document.querySelector(".home").style.pointerEvent = "none";
          document.querySelector(".home__title").style.pointerEvent = "none";
          document.querySelector(".home").style.display = "none";
          document.querySelector(".home__title").style.display = "none";

          this.eventsAnim();
        },
      }
    );
  }

  rayCaster() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    this.intersects = this.raycaster.intersectObjects(this.objectsToTest);
  }

  helpListener() {
    /// Step 1
    window.addEventListener(
      "scroll",
      debounce(() => {
        this.help.active();
        this.help.scroll();
      }, 5000)
    );
  }

  eventsAnim() {
    // STEP THREE
    let index = this.start;
    const btn = document.querySelector(".point");
    btn.addEventListener("click", () => {
      console.log("click");
      this.stepThree(index);
      index++;
      if (index === 4) {
        btn.style.display = "none";
      }
    });

    if (ios()) {
      window.addEventListener("touchstart", (event) => {
        this.mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      });
    } else {
      window.addEventListener("mousemove", (event) => {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      });
    }
  }

  addObject() {
    this.textIntro = new TextIntro({ scene: this.finalScene, scroll: this.scrollValue });
    this.textGod = new TextGod({ scene: this.finalScene, scroll: this.scrollValue, gui: this.gui });
    this.textPoint = new TextPoint({ scene: this.finalScene, scroll: this.scrollValue, gui: this.gui });
    this.textFinal = new TextFinal({ scene: this.finalScene, scroll: this.scrollValue, gui: this.gui });

    this.circle = new Circle({ scene: this.finalScene, gui: this.gui });
    this.singlePoint = new SinglePoint({
      scene: this.finalScene,
      positionCamera: this.createPath.cameraPath.cameraAndScreen.position,
      sizes: this.sizes,
      gui: this.gui,
    });
    this.sky = new Sky({ scene: this.finalScene, gui: this.gui });
    this.plane = new Plane({ scene: this.finalScene, gui: this.gui });
    this.moon = new Moon({ scene: this.finalScene, gui: this.gui });
    this.road = new Road({ scene: this.finalScene, gui: this.gui });
    this.planet = new Planet({ scene: this.finalScene, gui: this.gui });
    this.flower = new Flower({ scene: this.finalScene, gui: this.gui });

    this.progressBar = new Circle({ scene: this.finalScene, gui: this.gui });
    this.buttons = new Buttons({
      sizes: this.sizes,
      scene: this.scene,
      gui: this.gui,
      mouse: this.mouse,
      camera: this.createPath.cameraPath.splineCamera,
      singlePoint: this.singlePoint,
      points: this.singlePoint.points,
      moon: this.moon,
      road: this.road,
      flower: this.flower,
      sky: this.sky,
      finalScene: this.finalScene,
      screen: this.createPath.cameraPath.screenMaterial,
      textGod: this.textGod,
      textFinal: this.textFinal,
    });

    this.textIntro.init();
    this.textGod.init();
    this.textPoint.init();
    this.textFinal.init();

    this.circle.init();
    this.singlePoint.init();
    this.sky.init();
    this.moon.init();
    this.road.init();
    this.plane.init();
    this.planet.init();
    this.flower.init();

    this.progressBar.init();
    this.buttons.init();
  }

  manageCamera() {
    this.createPath = new CreatePath({
      container: this.container,
      scene: this.scene,
      camera: this.camera,
      controls: this.controls,
      renderer: this.renderer,
      gui: this.gui,
      sizes: this.sizes,
    });

    this.createPath.cameraPath.cameraSpeed = 0;
  }

  createTimelines() {
    this.tl = gsap.timeline({
      paused: true,
    });

    this.tl2 = gsap.timeline({
      paused: true,
    });

    this.tl3 = gsap.timeline({
      paused: true,
    });

    this.tl4 = gsap.timeline({
      paused: true,
    });

    this.tlText = gsap.timeline({
      paused: true,
    });
  }

  getScroll() {
    window.addEventListener("scroll", (e) => {
      this.scrollValue = window.scrollY / document.body.scrollHeight;
    });
  }

  getScrollSpeed() {
    window.addEventListener("scroll", () => {
      this.scrollSpeed = checkScrollSpeed({ delay: 40 });

      gsap.to(this.scrollSpeedEased, {
        value: this.scrollSpeed,
        duration: 1,
      });
    });
  }

  anim() {
    this.tl2.play();

    this.stepTwo();
    if (this.backstage) {
      this.stepFour();
    }
  }

  stepOne(index) {
    this.textIntro.animText(index);
  }

  stepTwo() {
    // FADE IN  Single point

    // BIGGER Single point
    this.tl2.fromTo(
      this.singlePoint.material.uniforms.isPressed,
      {
        value: 2.5,
      },
      {
        value: 1,
        duration: 5,
      },
      "<"
    );
    // FADE IN  BG Single point
    this.tl2.fromTo(
      this.singlePoint.materialBG.uniforms.opacity,
      {
        value: 0,
      },
      {
        value: 1,
        duration: 10,
      },
      "<"
    );
  }

  stepThree(index) {
    this.textPoint.animText(index);

    this.tl3.clear();
    this.tl3.play();

    // SMALLER Point
    this.tl3.to(this.singlePoint.material.uniforms.isPressed, {
      value: 2.5,
    });

    // SMALLER BG Point
    this.tl3.to(
      this.singlePoint.materialBG.uniforms.isPressed,
      {
        value: 2.5,
      },
      "<"
    );

    // BIGGER Points
    this.tl3.to(this.singlePoint.material.uniforms.isPressed, {
      duration: 2,
      value: 1,
    });

    // BIGGER BG Points
    this.tl3.to(
      this.singlePoint.materialBG.uniforms.isPressed,
      {
        duration: 2,
        value: 1,
      },
      "<"
    );
    if (index === 3) {
      this.stepFour();
    }
  }

  stepFour() {
    const tl = gsap.timeline();
    this.progress2 = 0;

    // DEZOOM Single point
    tl.to(
      this.singlePoint.mesh.position,
      {
        duration: 6,
        z: -300,
      },
      "<"
    );

    // FADE IN Sky
    tl.to(
      this.sky,
      {
        opacity: 1,
        duration: 12,
      },

      "<"
    );

    tl.to(
      this.singlePoint.points.pointsMaterial.uniforms.opacity,
      {
        value: 1,
        duration: 10,
      },
      "<"
    );
    tl.to(
      this.singlePoint.points.pointsMaterial2.uniforms.opacity,
      {
        value: 1,
        duration: 10,
      },
      "<"
    );

    const steps = {
      step1: {
        duration: 3,
        progress: 1100,
      },
      step2: {
        duration: 10,
        progress: 5500,
      },
      step3: {
        duration: 20,
        progress: 19500,
      },
    };

    // PROGRESSION CAM 1 UNtil Moon
    this.tl4.to(
      this.createPath.cameraPath,
      {
        progress: steps.step1.progress,
        duration: steps.step1.duration,
        ease: "linear",
      },
      "<"
    );

    // PROGRESSION CAM 2 Until buildings
    this.tl4.to(
      this.createPath.cameraPath,
      {
        progress: steps.step2.progress,
        delay: steps.step1.duration,
        duration: steps.step2.duration,
        ease: "linear",
        onComplete: () => {},
      },

      "<"
    );

    // PROGRESSION CAM 3 Until Planet
    this.tl4.to(
      this.createPath.cameraPath,
      {
        progress: steps.step3.progress,
        delay: steps.step2.duration,
        duration: steps.step3.duration,
        ease: "linear",
      },

      "<"
    );
  }

  finalStep() {
    const camera = this.createPath.cameraPath.cameraAndScreen;
  }

  animCamera(progress, time) {
    this.createPath.anim();
    this.createPath.cameraPath.anim(progress, time);
  }

  animObjects(progress, time) {
    this.tl.progress(progress * 0.3);
    this.tl4.progress(this.progress2 * 0.8);
    this.singlePoint.anim(progress, time);
    this.sky.anim(progress, time, this.scrollSpeedEased);
    this.flower.anim(progress, time);
    this.buttons.anim(progress, time);

    if (this.progress > this.steps[0]) {
    }
  }

  computeDelta(progress) {
    this.delta = progress - this.currentScroll;
    this.currentScroll = progress;
  }

  animText(progress, time) {
    this.textIntro.anim(progress * 12, time);
    this.textGod.anim(progress * 12, time);
    this.textPoint.anim(progress * 12, time);
    this.textFinal.anim(progress * 12, time);

    this.road.anim(progress * 12, time);
    this.singlePoint.points.anim(progress * 12, time, this.scrollSpeedEased.value);
  }

  render() {
    // Params
    const speedFactor = 100;
    this.time += 0.0001 * speedFactor;
    this.progress = this.scrollValue * 6;

    this.computeDelta(this.progress);

    // Buttons
    if (this.buttons.destroy) {
      this.destroyAll();
    }

    // Progress Bar TEST
    // document.querySelector(".progress").style.transform = `scaleX(${this.progress / 2})`;

    ///////////////////////////////////////// Test without scrollBar
    if (this.backstage) {
      this.progress = this.time;
      // this.progress2 = this.time * 0.2;
      this.progress2 = this.positionTimeline;
      document.body.classList.remove("scroll");
      document.querySelector(".home").style.opacity = 0;
      //this.gui.show();
      this.singlePoint.points.pointsMaterial.uniforms.opacity.value = 1;
      this.singlePoint.points.pointsMaterial2.uniforms.opacity.value = 1;
      this.sky.material.uniforms.opacity.value = 1;
      this.tl2.play();
      this.singlePoint.mesh.position.y = this.createPath.cameraPath.cameraAndScreen.position.y;
      this.sky.opacity = 1;
    }
    ///////////////////////////////////////// End Test without scrollBar
    // Animation objects
    this.animObjects(this.progress, this.time);
    this.progress2 += this.delta;

    // Animations object materials
    this.circle.anim(this.time, this.progress);

    // Animation Text
    if (this.textIntro.isLoaded) {
      this.animText(this.progress, this.time);
    }

    // Animation camera
    this.animCamera(this.progress, this.time);

    // RayCasting
    this.rayCaster();
    this.buttons.rayCaster();

    // Check position timeline
    // if (this.progress2 > 0.8) {
    //   this.upCityLights();
    // }
  }
}
