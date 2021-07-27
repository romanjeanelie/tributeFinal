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

    this.currentIntersect = null;
    this.intersects = null;

    this.scrollValue = 0;

    this.steps = [1.4];
    this.delta = 0;
    this.currentScroll = 0;

    gsap.registerPlugin(SplitText);

    // DEBUG MODE /////////////////////////////////////////////////////////////////////////////////
    this.backstage = false;
    this.positionTimeline = 0.75;
    this.start = 0;
    // DEBUG MODE /////////////////////////////////////////////////////////////////////////////////

    // START DIRECTLY //////////////////////////////////////////////////////////////////////////////
    // this.startProject();
    // document.querySelector(".home").style.display = "none";
    // START DIRECTLY //////////////////////////////////////////////////////////////////////////////

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
        progressEl.innerHTML = `${Math.min(Math.round(progressRatio * 100), 100)}%`;
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
    this.anim();
    this.render();

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

    // Fade out subtitle

    const subtitleSplit = new SplitText(".home__subtitle h2", { type: "words,chars" });

    let index1 = Math.round(subtitleSplit.chars.length / 2);
    let index2 = Math.round(subtitleSplit.chars.length / 2);

    let chars = subtitleSplit.chars[index1];

    const durationIn = 3;
    const ease = "linear";
    this.tlSubtitle = gsap.timeline({ delay: 1.5, paused: true });

    this.tlSubtitle.to(chars, {
      opacity: 0,
      color: "#F41B0C",
      ease,
      duration: durationIn,
    });
    for (let i = 0; i < subtitleSplit.chars.length; i++) {
      index1 += 1;
      if (subtitleSplit.chars[index1]) {
        let chars = subtitleSplit.chars[index1];
        this.tlSubtitle.to(
          chars,
          {
            delay: i * 0.002,
            color: "#F41B0C",
            opacity: 0,

            ease,
            duration: durationIn,
          },
          "<"
        );
      }
      index2 -= 1;
      if (subtitleSplit.chars[index2]) {
        let chars = subtitleSplit.chars[index2];
        this.tlSubtitle.to(
          chars,
          {
            delay: i * 0.002,
            opacity: 0,
            color: "#F41B0C",
            ease,
            opacity: 0,

            duration: durationIn,
          },
          "<"
        );
      }
    }

    tl.to(".home__subtitle h2", {
      delay: 1,
      duration: 8,
      onStart: () => {
        this.tlSubtitle.play();
      },
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
        // Authorize scroll
        document.body.style.overflow = "auto";
      }
    });

    // Help
    setTimeout(() => {
      if (unclick) {
        this.help.displayClick();
      } else {
        return;
      }
    }, 6000);
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
    this.tl2 = gsap.timeline({
      paused: true,
    });

    this.tl3 = gsap.timeline({
      paused: true,
    });

    this.tl4 = gsap.timeline({
      paused: true,
    });
  }

  getScroll() {
    window.addEventListener("scroll", (e) => {
      this.scrollValue = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      console.log(this.progress);
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
    }, 5500);

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
    // End help

    const tl = gsap.timeline();

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
        duration: 4,
        ease: "expo.in",
      },
      "<"
    );

    const tlSky = gsap.timeline({ paused: true });
    const road = this.road;

    tlSky.to(this.sky, {
      opacity: 1,
      duration: 20,
    });
    // PROGRESSION CAM
    this.tl4.to(
      this.createPath.cameraPath,
      {
        progress: 19500,
        duration: 20,
        ease: "linear",
        onUpdate: function () {
          if (this.progress() > 0.234) {
            tlSky.play();
          }
          if (this.progress() > 0.66) {
            road.stadium.stadium.clear();
            road.bridge.bridge.clear();
            road.buildingsGroup.clear();
          }
        },
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

    this.tl4.to(
      this.sky.changeColor,
      {
        delay: 5,
        duration: 7,
        value: 1,
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
    this.tl4.progress(this.progress);
    this.singlePoint.anim(progress, time);
    this.sky.anim(progress, time);
    this.plane.anim(progress, time);
    this.flower.anim(progress, time);
    this.buttons.anim(progress, time);
  }

  animText(progress, time) {
    this.textGod.anim(progress * 12, time);
    this.textPoint.anim(progress * 12, time);
    this.textFinal.anim(progress * 12, time);

    this.road.anim(progress * 12, time);
    this.singlePoint.points.anim(progress * 12, time);
  }

  render() {
    // Params
    const speedFactor = 100;
    this.time += 0.0001 * speedFactor;
    this.progress = this.scrollValue * 1.1;

    // Animation objects
    this.animObjects(this.progress, this.time);
    this.animText(this.progress, this.time);
    this.animCamera(this.progress, this.time);

    ///////////////////////////////////////// Test without scrollBar
    if (this.backstage) {
      this.progress = this.positionTimeline;
      document.body.classList.remove("scroll");
      document.querySelector(".home").style.opacity = 0;
      //this.gui.show();
      this.singlePoint.points.pointsMaterial.uniforms.opacity.value = 1;
      this.tl2.play();
      this.singlePoint.mesh.position.y = this.createPath.cameraPath.cameraAndScreen.position.y;
      this.sky.opacity = 1;
    }
    ///////////////////////////////////////// End Test without scrollBar
  }
}
