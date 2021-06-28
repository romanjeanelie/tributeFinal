import * as THREE from "three";
import gsap from "gsap";
import TextIntro from "./textIntro";
import TextGod from "./textGod";
import TextPoint from "./textPoint";
import TextStars from "./textStars/textStars";
import Circle from "./circle";
import SinglePoint from "./singlePoint";
import Points from "./points";
import Sky from "./sky";
import Plane from "./plane";
import Moon from "./moon/moon";
import Road from "./street/road";
import Planet from "./planet";
import Buttons from "./buttons";
import BackSky from "./backSky";

import progressBar from "./progressBar";

import CreatePath from "./camera/createPath";

import ios from "./utils/ios";
import debounce from "./utils/debounce";
import { checkScrollSpeed } from "./utils/checkScrollSpeed";
import once from "./utils/once";

import Help from "./domElements/help";

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

    // DEBUG MODE ////////////////////////////
    this.backstage = false;
    this.positionTimeline = 2;
    this.start = 0;
    // DEBUG MODE ////////////////////////////

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

    this.init();
  }

  init() {
    this.manageCamera();
    this.manageProgressBar();
    this.addObject();
    this.createTimelines();
    this.getScroll();
    this.getScrollSpeed();
    this.objectsToTest = [this.singlePoint.mesh];
    this.anim();
    this.render();

    this.helpListener();
    this.startListener();

    //////// START DIRECTLY ////////
    // this.startProject();
    // document.querySelector(".home").style.display = "none";
    //////// START DIRECTLY ////////

    if (this.backstage) {
      console.log(document.querySelector(".home"));
      document.querySelector(".home").style.display = "none";
    }
  }

  startListener() {
    const startBtn = document.getElementById("start");

    startBtn.addEventListener("click", () => {
      this.startProject();
    });
  }

  startProject() {
    const tl = gsap.timeline();

    tl.to(".line", {
      scaleX: 1,
      duration: 1,
    });

    tl.to(
      ".home__title, #start",
      {
        color: "#f00",
        duration: 1,
      },
      "<"
    );
    tl.to(".line", {
      autoAlpha: 0,
      duration: 0.5,
    });
    tl.to(
      ".home .bg__top",
      {
        scaleY: 0.4,
        duration: 2,
      },
      "<"
    );

    tl.to(
      ".home .bg__bottom",
      {
        scaleY: 0.4,
        duration: 2,
      },
      "<"
    );
    tl.to(
      ".home .title__top",
      {
        y: "-40vh",
        autoAlpha: 0,
        duration: 2,
      },
      "<"
    );
    tl.to(
      ".home .title__bottom",
      {
        y: "40vh",
        autoAlpha: 0,
        duration: 2,
      },
      "<"
    );

    tl.to(
      "#start",
      {
        autoAlpha: 0,
        duration: 2,
        onComplete: () => this.eventsAnim(),
      },
      "<"
    );
    tl.to(".home .bg", {
      autoAlpha: 0,
      onComplete: () => {
        document.querySelector(".home").style.pointerEvent = "none";
      },
    });
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
    // STEP ONE
    let indexOne = this.start;

    window.addEventListener("scroll", () => {
      this.help.inactive();

      if (this.textIntro.animComplete && indexOne < this.textIntro.materialsText.length + 1) {
        this.stepOne(indexOne);
        indexOne++;
        if (indexOne === this.textIntro.materialsText.length + 1) {
          this.tl2.play();
        }
      }
    });

    // STEP THREE
    const tl = gsap.timeline();
    if (ios()) {
      let index = -1;

      window.addEventListener("touchstart", (event) => {
        this.mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
        if (this.intersects.length) {
          this.stepThree(index);
          index++;
        }
      });
    } else {
      let index = 0;

      window.addEventListener("mousemove", (event) => {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      });

      window.addEventListener("click", () => {
        if (this.intersects.length) {
          this.stepThree(index);
          index++;
        }
      });
    }
  }

  addObject() {
    this.textIntro = new TextIntro({ scene: this.finalScene, scroll: this.scrollValue });
    this.textGod = new TextGod({ scene: this.finalScene, scroll: this.scrollValue, gui: this.gui });
    this.textPoint = new TextPoint({ scene: this.finalScene, scroll: this.scrollValue, gui: this.gui });
    this.textStars = new TextStars({ scene: this.finalScene, scroll: this.scrollValue, gui: this.gui });

    this.circle = new Circle({ scene: this.finalScene, gui: this.gui });
    this.singlePoint = new SinglePoint({ scene: this.finalScene, gui: this.gui });
    this.points = new Points({ scene: this.finalScene, gui: this.gui });
    this.sky = new Sky({ scene: this.finalScene, gui: this.gui });
    this.plane = new Plane({ scene: this.finalScene, gui: this.gui });
    this.moon = new Moon({ scene: this.finalScene, gui: this.gui });
    this.road = new Road({ scene: this.finalScene, gui: this.gui });
    this.planet = new Planet({ scene: this.finalScene, gui: this.gui });
    this.backSky = new BackSky({ scene: this.finalScene, gui: this.gui });

    this.progressBar = new Circle({ scene: this.finalScene, gui: this.gui });
    this.buttons = new Buttons({
      scene: this.scene,
      gui: this.gui,
      mouse: this.mouse,
      camera: this.createPath.cameraPath.splineCamera,
      road: this.road,
      finalScene: this.finalScene,
    });

    this.textIntro.init();
    this.textGod.init();
    this.textPoint.init();
    this.textStars.init();

    this.circle.init();
    this.singlePoint.init();
    this.points.init();
    this.sky.init();
    this.moon.init();
    this.road.init();
    this.plane.init();
    this.planet.init();
    this.backSky.init();

    this.progressBar.init();
    this.buttons.init();
  }

  manageProgressBar() {}

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
    this.tl2.fromTo(
      this.singlePoint.material.uniforms.opacity,
      {
        value: 0,
      },
      {
        value: 1,
        duration: 20,
      }
    );
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
    const camera = this.createPath.cameraPath.cameraAndScreen;

    const tl = gsap.timeline();
    this.progress2 = 0;
    // ZOOM Lines
    tl.to(this.createPath.cameraPath.screenMaterial.uniforms.thickFactor, {
      duration: 3,
      value: 0,
      ease: "Power3.in",
    });

    // OPEN Wide BG
    tl.to(
      this.createPath.cameraPath.screenMaterial.uniforms.wide,
      {
        duration: 12,
        value: 1,
        ease: "Power3.in",
      },
      "<"
    );

    // FADE OUT Screen
    tl.to(
      this.createPath.cameraPath.screenMaterial.uniforms.opacity,
      {
        duration: 12,
        value: 0,
        ease: "Power3.in",
      },
      "<"
    );

    // FADE OUT Opacity Light BG
    tl.to(
      this.singlePoint.materialBG.uniforms.opacity,
      {
        duration: 12,
        value: 0,
        ease: "Power3.in",
      },
      "<"
    );

    // DEZOOM Single point
    tl.to(
      this.singlePoint.mesh.position,
      {
        duration: 6,
        z: -300,
      },
      "<"
    );

    // FADE IN Text God
    tl.to(
      this.textGod.opacity,
      {
        value: 1,
        duration: 20,
      },
      "<"
    );

    // SQUEEZE Text God
    tl.to(
      this.textGod.squeeze,
      {
        value: 0,
        delay: 0.3,
        duration: 3,
      },
      "<"
    );

    // DEZOOM Text God
    tl.to(
      this.textGod.textGroup.position,
      {
        z: -115,
        duration: 12,
      },

      "<"
    );

    // FADE IN Lines sky
    tl.to(
      this.sky.material.uniforms.opacity,
      {
        value: 0.01,
        duration: 12,
      },

      "<"
    );

    tl.to(
      this.points.pointsMaterial.uniforms.opacity,
      {
        value: 1,
        duration: 10,
      },
      "<"
    );
    tl.to(
      this.points.pointsMaterial2.uniforms.opacity,
      {
        value: 1,
        duration: 10,
      },
      "<"
    );

    const steps = {
      step1: {
        duration: 1,
        progress: 1100,
      },
      step2: {
        duration: 8,
        progress: 5500,
      },
      step3: {
        duration: 8,
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
        onComplete: () => {
          gsap.to(this.moon.moonMaterial.uniforms.wide, {
            duration: 15,
            value: 4.5,
            ease: "linear",
          });
          gsap.to(this.moon.moonMaterial.uniforms.opacity, {
            duration: 5,
            value: 1,
            ease: "linear",
          });
        },
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

    // SKY Getting lighter
    this.tl4.to(
      this.sky.material.uniforms.changeColor,
      {
        duration: 5,
        value: 1,
        ease: "linear",
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
        onStart: () => {
          gsap.to(this.planet.planetMaterial.uniforms.changeColor, {
            value: 1,
            duration: 8,
            ease: "linear",
          });
          // FADE IN MoreLines sky
          gsap.to(this.sky.material.uniforms.opacity, {
            value: 0.06,
            delay: 6,
            duration: 12,
          });
        },
        // onComplete: () => this.finalStep(),
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
    this.tl4.progress(this.progress2 * 0.5);
    this.singlePoint.anim(progress, time);
    this.sky.anim(progress, time, this.scrollSpeedEased);
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
    // this.textGod.animText(progress * 0.5);
    this.textPoint.anim(progress * 12, time);
    this.textStars.anim(progress * 12, time, this.scrollSpeedEased.value);

    this.road.anim(progress * 12, time);
    this.points.anim(progress * 12, time, this.scrollSpeedEased.value);
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
    document.querySelector(".progress").style.transform = `scaleX(${this.progress / 2})`;

    ///////////////////////////////////////// Test without scrollBar
    if (this.backstage) {
      this.progress = this.time;
      // this.progress2 = this.time * 0.2;
      this.progress2 = this.positionTimeline;
      document.body.classList.remove("scroll");
      document.querySelector(".home").style.opacity = 0;
      //this.gui.show();
      this.points.pointsMaterial.uniforms.opacity.value = 1;
      this.points.pointsMaterial2.uniforms.opacity.value = 1;
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
  }
}
