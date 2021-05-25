import * as THREE from "three";
import gsap from "gsap";
import TextIntro from "./textIntro";
import TextGod from "./textGod";
import TextPoint from "./textPoint";
import Circle from "./circle";
import SinglePoint from "./singlePoint";
import Points from "./points";
import Plane from "./plane";
import Moon from "./moon/moon";
import Road from "./street/road";
import CreatePath from "./camera/createPath";

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

    //this.objects = options.objects;

    this.scrollValue = 0;

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
    let index = 0;
    const tl = gsap.timeline();
    window.addEventListener("mousemove", (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener("click", () => {
      if (this.intersects.length) {
        this.textPoint.animText(index);
        tl.to(this.singlePoint.material.uniforms.isPressed, {
          value: 2.5,
        });
        tl.to(this.singlePoint.material.uniforms.isPressed, {
          duration: 5,
          value: 1,
        });

        index++;
      } else {
        console.log("clic outside the ball");
      }
    });
  }

  addObject() {
    this.textIntro = new TextIntro({ scene: this.scene, scroll: this.scrollValue });
    this.textGod = new TextGod({ scene: this.scene, scroll: this.scrollValue, gui: this.gui });
    this.textPoint = new TextPoint({ scene: this.scene, scroll: this.scrollValue, gui: this.gui });

    this.circle = new Circle({ scene: this.scene, gui: this.gui });
    this.singlePoint = new SinglePoint({ scene: this.scene, gui: this.gui });
    this.points = new Points({ scene: this.scene, gui: this.gui });
    this.plane = new Plane({ scene: this.scene, gui: this.gui });
    this.moon = new Moon({ scene: this.scene, gui: this.gui });
    this.road = new Road({ scene: this.scene, gui: this.gui });

    this.textIntro.init();
    this.textGod.init();
    this.textPoint.init();

    this.circle.init();
    this.singlePoint.init();
    this.points.init();
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
  }

  createTimelines() {
    this.tl = gsap.timeline({
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
    // this.stepThree();
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
    this.tl.fromTo(
      this.singlePoint.material.uniforms.opacity,
      {
        value: 0,
      },
      {
        value: 1,
        duration: 150,
        delay: 30,
      },
      "<"
    );

    // Single point GETTING CLOSER
    this.tl.to(
      this.singlePoint.mesh.position,
      {
        z: -100,
        duration: 40,
        delay: 30,
      },
      "<"
    );

    // FADE OUT Text God
    this.tl.to(
      this.textGod.opacity,
      {
        value: 0,
        duration: 40,
        delay: 0,
      },
      "<"
    );
  }

  stepThree() {
    // APPEAR Points 1
    this.tl.fromTo(
      this.points.pointsMaterial1.uniforms.opacity,
      {
        value: 0,
      },
      {
        value: 1,
        duration: 10,
      }
    );

    this.tl.fromTo(
      this.points.pointsMaterial2.uniforms.opacity,
      {
        value: 0,
      },
      {
        value: 1,
        duration: 30,
        delay: 10,
      },
      "<"
    );

    this.tl.fromTo(
      this.points.pointsMaterial3.uniforms.opacity,
      {
        value: 0,
      },
      {
        value: 1,
        duration: 50,
        delay: 10,
      },
      "<"
    );
  }

  animCamera() {
    this.createPath.cameraPath.cameraSpeed = 0;

    this.createPath.anim();
    this.createPath.cameraPath.anim(this.time);
  }

  animObjects(progress, time) {
    this.tl.progress(time * 0.005 + progress * 0.2);
    this.singlePoint.anim(progress, time);
  }

  animText(progress, time) {
    this.textIntro.anim(progress * 12, time);
    this.textIntro.animText(progress * 1);
    this.textGod.anim(progress * 12, time);
    this.textGod.animText(progress * 0.5);
    this.textPoint.anim(progress * 12, time);
  }

  render() {
    // Params
    const speedFactor = 100;
    this.time += 0.0001 * speedFactor;
    this.progress = this.scrollValue * 6;

    // Animation objects
    // this.tl.progress(this.time * this.progress * 0.02);
    this.animObjects(this.progress, this.time);

    // Animations object materials
    this.circle.anim(this.time, this.progress);

    // Animation Text
    setTimeout(() => {
      this.animText(this.progress, this.time);
    }, 1000);

    // Animation camera
    this.animCamera();

    // RayCasting
    this.rayCaster();
  }
}
