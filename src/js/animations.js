import * as THREE from "three";
import gsap from "gsap";
import TextIntro from "./textIntro";
import TextGod from "./textGod";
import TextPoint from "./textPoint";
import Circle from "./circle";
import SinglePoint from "./singlePoint";
import Points from "./points";
import Clouds from "./clouds";
import Plane from "./plane";
import Moon from "./moon/moon";
import Road from "./street/road";
import CreatePath from "./camera/createPath";

import ios from "./utils/ios";

export default class Animations {
  constructor(options) {
    let start = 0;
    this.time = start;
    this.timeText = start;

    this.scene = options.scene;
    this.gui = options.gui;
    this.camera = options.camera;
    this.container = options.container;
    this.renderer = options.renderer;
    this.controls = options.controls;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.currentIntersect = null;
    this.intersects = null;

    this.scrollValue = 0;
    this.progress2 = 0;

    this.steps = [1.4];
    this.delta = 0;
    this.currentScroll = 0;

    this.init();
  }

  init() {
    this.addObject();
    this.manageCamera();
    this.createTimelines();
    this.getScroll();
    this.objectsToTest = [this.singlePoint.mesh];
    this.render();

    this.onMouseMove();
  }

  rayCaster() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    this.intersects = this.raycaster.intersectObjects(this.objectsToTest);
  }

  onMouseMove() {
    const tl = gsap.timeline();
    if (ios()) {
      let index = -1;

      window.addEventListener("touchstart", (event) => {
        console.log(this.mouse.x);
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
    this.textIntro = new TextIntro({ scene: this.scene, scroll: this.scrollValue });
    this.textGod = new TextGod({ scene: this.scene, scroll: this.scrollValue, gui: this.gui });
    this.textPoint = new TextPoint({ scene: this.scene, scroll: this.scrollValue, gui: this.gui });

    this.circle = new Circle({ scene: this.scene, gui: this.gui });
    this.singlePoint = new SinglePoint({ scene: this.scene, gui: this.gui });
    this.points = new Points({ scene: this.scene, gui: this.gui });
    this.clouds = new Clouds({ scene: this.scene, gui: this.gui });
    this.plane = new Plane({ scene: this.scene, gui: this.gui });
    this.moon = new Moon({ scene: this.scene, gui: this.gui });
    this.road = new Road({ scene: this.scene, gui: this.gui });

    this.textIntro.init();
    this.textGod.init();
    this.textPoint.init();

    this.circle.init();
    this.singlePoint.init();
    this.points.init();
    this.clouds.init();
    this.plane.init();
    this.moon.init();
    this.road.init();
  }

  manageCamera() {
    this.createPath = new CreatePath({
      container: this.container,
      scene: this.scene,
      camera: this.camera,
      controls: this.controls,
      renderer: this.renderer,
      gui: this.gui,
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

  anim() {
    this.stepOne();
    this.stepTwo();
    //this.stepFour();
  }

  stepOne() {
    this.tl.to(this.circle.circleMesh.position, {
      y: 0,
      duration: 60,
    });

    // ZOOM Circle
    this.tl.to(
      this.circle.circleMesh.position,
      {
        z: 20,
        delay: 20,
        duration: 100,
      },
      "<"
    );
  }

  stepTwo() {
    // FADE IN Single point
    this.tl2.fromTo(
      this.singlePoint.material.uniforms.opacity,
      {
        value: 0,
      },
      {
        value: 1,
        duration: 10,
      }
    );

    // FADE IN Text God
    this.tl2.to(
      this.textGod.opacity,
      {
        value: 1,
        duration: 5,
        delay: 2,
      },
      "<"
    );
    // FADE OUT Circle
    this.tl2.to(
      this.circle.material.uniforms.opacity,
      {
        value: 0,
        duration: 5,
        delay: 0,
      },
      "<"
    );

    // // FADE OUT Text God
    // this.tl2.to(
    //   this.textGod.opacity,
    //   {
    //     value: 0,
    //     duration: 10,
    //     delay: 10,
    //   },
    //   "<"
    // );
  }

  stepThree(index) {
    this.textPoint.animText(index);

    this.tl3.clear();
    this.tl3.play();

    // SMALLER Point
    this.tl3.to(this.singlePoint.material.uniforms.isPressed, {
      value: 2.5,
    });

    // BIGGER Points
    this.tl3.to(this.singlePoint.material.uniforms.isPressed, {
      duration: 2,
      value: 1,
    });
    if (index === 3) {
      this.stepFour();
    }
  }

  stepFour() {
    const tl = gsap.timeline();
    this.progress2 = 0;

    console.log("step four", this.progress2);

    // DEZOOM Single point
    tl.to(this.singlePoint.mesh.position, {
      duration: 6,
      z: -60.5,
    });

    // DEZOOM Text God
    tl.to(
      this.textGod.textGroup.position,
      {
        z: -90,
        duration: 6,
      },

      "<"
    );

    // FADE IN Sky
    tl.to(
      this.clouds.material.uniforms.opacity,
      {
        value: 1,
        delay: 1,
        duration: 10,
      },
      "<"
    );

    // FADE IN All Points
    tl.to(
      this.points.pointsMaterial1.uniforms.opacity,
      {
        value: 1,
        delay: 1,
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
    tl.to(
      this.points.pointsMaterial3.uniforms.opacity,
      {
        value: 1,
        duration: 10,
      },
      "<"
    );
    this.tl4.to(
      this.createPath.cameraPath,
      {
        progress: 9350,
        duration: 10,
        ease: "linear",
      },

      "<"
    );
    this.tl4.to(
      this.createPath.cameraPath,
      {
        progress: 19500,
        delay: 10,
        duration: 10,
        ease: "linear",
      },

      "<"
    );
  }

  animCamera(progress, time) {
    this.createPath.anim();
    this.createPath.cameraPath.anim(progress);
  }

  animObjects(progress, time) {
    this.tl.progress(progress * 0.3);
    this.tl4.progress(this.progress2 * 0.7);
    this.singlePoint.anim(progress, time);

    if (this.progress > this.steps[0]) {
      this.tl2.play();
    }
  }

  computeDelta(progress) {
    this.delta = progress - this.currentScroll;
    this.currentScroll = progress;
  }

  animText(progress, time) {
    this.textIntro.anim(progress * 12, time);
    this.textIntro.animText(progress * 1);
    this.textGod.anim(progress * 12, time);
    // this.textGod.animText(progress * 0.5);
    this.textPoint.anim(progress * 12, time);
  }

  render() {
    // Params
    const speedFactor = 100;
    this.time += 0.0001 * speedFactor;
    this.progress = this.scrollValue * 6;

    this.computeDelta(this.progress);

    ///////////////////////////////////////// Test without scrollBar
    // this.progress = this.time;
    // this.progress2 = this.time * 0.2;
    // this.progress = this.time;
    // this.progress2 = 1;
    //document.body.classList.remove("scroll");
    // this.gui.show();
    // this.points.pointsMaterial1.uniforms.opacity.value = 1;
    // this.points.pointsMaterial2.uniforms.opacity.value = 1;
    // this.points.pointsMaterial3.uniforms.opacity.value = 1;
    ///////////////////////////////////////// End Test without scrollBar

    // Animation objects
    this.animObjects(this.progress, this.time);
    this.progress2 += this.delta;

    // Animations object materials
    this.circle.anim(this.time, this.progress);

    // Animation Text
    setTimeout(() => {
      this.animText(this.progress, this.time);
    }, 1000);

    // Animation camera
    this.animCamera(this.progress, this.time);

    // RayCasting
    this.rayCaster();
  }
}
