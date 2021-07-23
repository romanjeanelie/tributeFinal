import * as THREE from "three";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import TextGod from "./textGod";
import TextPoint from "./textPoint";
import TextFinal from "./textFinal";
import SinglePoint from "./singlePoint";
import Sky from "./sky";
import Plane from "./plane";
import Moon from "./moon/moon";
import Road from "./street/road";
import Planet from "./planet";
import Buttons from "./buttons";
import Flower from "./flower";

import CreatePath from "./camera/createPath";

import debounce from "./utils/debounce";
import ios from "./utils/ios";
import { checkScrollSpeed } from "./utils/checkScrollSpeed";

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

    // Timeline texts
    // 0.07
    // 0.12
    // 0.2
    // 0.34
    // DEBUG MODE /////////////////////////////////////////////////////////////////////////////////

    // Set Loader
    this.loadingManager = new THREE.LoadingManager(
      // Loaded
      () => {
        // Wait a little
        window.setTimeout(() => {
          this.displayHome();
        }, 500);

        window.setTimeout(() => {}, 500);
      },

      // Progress
      (itemUrl, itemsLoaded, itemsTotal) => {
        // Calculate the progress and update the loadingBarElement
        const progressRatio = itemsLoaded / itemsTotal;
        const progressEl = document.querySelector(".loader p");
        progressEl.innerHTML = `${Math.round(progressRatio * 100)}%`;
      }
    );
    // End set Loader

    this.help = new Help();
    this.scrollActive = false;

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

    // START DIRECTLY //////////////////////////////////////////////////////////////////////////////
    // this.startProject();
    // document.querySelector(".home").style.display = "none";
    // START DIRECTLY //////////////////////////////////////////////////////////////////////////////

    if (this.backstage) {
      document.querySelector(".home").style.display = "none";
      document.querySelector(".help").style.display = "none";
    }
  }

  displayHome() {
    const durationIn = 2;
    const durationOut = 2;
    const startBtn = document.getElementById("start");

    const tl = gsap.timeline();
    tl.to(".loader p", {
      y: "-100%",
      onComplete: () => {
        document.querySelector(".loader").style.display = "none";
      },
    });

    tl.to(".home__title h1", {
      y: 0,
      duration: 3.5,
      ease: "expo.out",
    });
    tl.to(
      ".home__start p",
      {
        y: 0,
        delay: 0.4,
        duration: 3.5,
        ease: "expo.out",
      },
      "<"
    );

    startBtn.addEventListener("click", () => {
      this.startProject();
    });
  }

  startProject() {
    const tl = gsap.timeline();

    tl.to("#start p", {
      autoAlpha: 0,
    });

    tl.to(
      ".home__title",
      {
        rotateX: -90,
        duration: 0.8,
      },
      "<"
    );

    tl.to(
      ".home__subtitle",
      {
        rotateX: 0,
        duration: 1.5,
      },
      "<"
    );

    tl.to(".home__subtitle h2", {
      opacity: 0,
      color: "#F41B0C",
      delay: 1,
      duration: 4,
      ease: "power2.in",
      onComplete: () => {
        document.querySelector(".home").style.display = "none";
      },
    });

    tl.fromTo(
      this.singlePoint.material.uniforms.opacity,
      {
        value: 0,
      },
      {
        value: 1,
        duration: 4,
        ease: "power2.in",
        onStart: () => {
          document.querySelector(".home").style.pointerEvents = "none";
          this.eventsAnim();
        },
      },
      "<"
    );
  }

  eventsAnim() {
    // STEP THREE
    let index = this.start;
    let unclick = true;

    const btn = document.querySelector(".point");
    btn.addEventListener("click", () => {
      unclick = false;

      this.stepThree(index);
      index++;
      this.help.hideClick();
      if (index === 4) {
        btn.style.display = "none";
        document.querySelector(".help__click").style.display = "none";
      }
    });

    // Help
    setTimeout(() => {
      if (unclick) {
        this.help.displayClick();
      } else {
        return;
      }
    }, 5000);
    if (index < 3) {
      btn.addEventListener("click", debounce(this.help.displayClick, 5000));
    }
  }

  addObject() {
    this.textGod = new TextGod({
      scene: this.finalScene,
      scroll: this.scrollValue,
      gui: this.gui,
      loadingManager: this.loadingManager,
    });
    this.textPoint = new TextPoint({
      scene: this.finalScene,
      scroll: this.scrollValue,
      gui: this.gui,
      loadingManager: this.loadingManager,
    });
    this.textFinal = new TextFinal({
      scene: this.finalScene,
      scroll: this.scrollValue,
      gui: this.gui,
      loadingManager: this.loadingManager,
    });

    this.singlePoint = new SinglePoint({
      scene: this.finalScene,
      positionCamera: this.createPath.cameraPath.cameraAndScreen.position,
      sizes: this.sizes,
      gui: this.gui,
    });

    this.sky = new Sky({ scene: this.finalScene, gui: this.gui });
    this.plane = new Plane({ scene: this.finalScene, gui: this.gui, loadingManager: this.loadingManager });
    this.moon = new Moon({ scene: this.finalScene, gui: this.gui });
    this.road = new Road({ scene: this.finalScene, gui: this.gui, loadingManager: this.loadingManager });
    this.planet = new Planet({ scene: this.finalScene, gui: this.gui });
    this.flower = new Flower({ scene: this.finalScene, gui: this.gui, loadingManager: this.loadingManager });

    this.buttons = new Buttons({
      sizes: this.sizes,
      scene: this.scene,
      gui: this.gui,
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
      plane: this.plane,
      planet: this.planet,
      help: this.help,
      loadingManager: this.loadingManager,
    });

    this.textGod.init();
    this.textPoint.init();
    this.textFinal.init();

    this.singlePoint.init();
    this.sky.init();
    this.moon.init();
    this.road.init();
    this.plane.init();
    this.planet.init();
    this.flower.init();

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
    const camera = this.createPath.cameraPath.cameraAndScreen;

    // Help
    const scrollActive = false;
    setTimeout(() => {
      if (scrollActive === false) {
        this.help.displayScroll1();
      } else {
        return;
      }
    }, 4000);

    window.addEventListener(
      "scroll",
      debounce(() => {
        this.help.displayScroll2();
      }, 1500)
    );

    window.addEventListener("scroll", () => {
      this.scrollActive = true;
      this.help.hideScroll1();
      this.help.hideScroll2();
    });
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

    // // PROGRESSION CAM 1 UNtil Moon
    this.tl4.to(
      this.createPath.cameraPath,
      {
        progress: steps.step1.progress,
        duration: steps.step1.duration,
        ease: "linear",
      },
      "<"
    );

    // FADE IN Sky
    this.tl4.to(
      this.sky,
      {
        opacity: 1,
        duration: 12,
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

    // CAMERA Rotation
    // this.tl4.to(
    //   camera.rotation,
    //   {
    //     x: 0.5,
    //     duration: steps.step2.duration,
    //     ease: "linear",
    //   },
    //   "<"
    // );

    // this.tl4.to(
    //   camera.rotation,
    //   {
    //     x: 0,
    //     delay: steps.step2.duration,
    //     duration: steps.step2.duration,

    //     ease: "linear",
    //   },
    //   "<"
    // );

    // PROGRESSION CAM 3 Until Planet
    this.tl4.to(
      this.createPath.cameraPath,
      {
        progress: steps.step3.progress,
        delay: steps.step2.duration,
        duration: steps.step3.duration,
        ease: "linear",
        onComplete: () => {
          if (this.backstage) {
            setTimeout(() => {
              document.querySelector(".help__scroll").style.display = "none";
              this.buttons.display();
            }, 600);
          } else {
            document.querySelector(".help__scroll").style.display = "none";
            this.buttons.display();
          }
        },
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
    this.plane.anim(progress, time);
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
      // this.sky.opacity = 1;
    }
    ///////////////////////////////////////// End Test without scrollBar
    // Animation objects
    this.animObjects(this.progress, this.time);
    this.animText(this.progress, this.time);
    this.progress2 += this.delta;

    // Animation camera
    this.animCamera(this.progress, this.time);
  }
}
