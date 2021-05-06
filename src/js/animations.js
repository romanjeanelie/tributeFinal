import gsap from "gsap";
import Text from "./text";
import Circle from "./circle";
import SinglePoint from "./singlePoint";
import Points from "./points";

export default class Animations {
  constructor(options) {
    this.time = 0;

    this.scene = options.scene;
    this.gui = options.gui;
    this.camera = options.camera;
    this.objects = options.objects;

    this.scrollValue = 0;

    this.init();
  }

  init() {
    this.addObject();
    this.createTimelines();
    this.getScroll();
    this.render();

    this.eventListener();
  }

  addObject() {
    this.text = new Text({ scene: this.scene, gui: this.gui });
    this.circle = new Circle({ scene: this.scene, gui: this.gui });
    this.singlePoint = new SinglePoint({ scene: this.scene, gui: this.gui });
    this.points = new Points({ scene: this.scene, gui: this.gui });
    this.circle.init();
    this.singlePoint.init();
    this.points.init();
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
      console.log(this.scrollValue);
    });
  }

  anim() {
    this.text.anim(this.tlText);
    this.stepOne();
    this.stepTwo();
    this.stepThree();
  }

  stepOne() {
    this.tl.fromTo(
      this.circle.circleMesh.position,
      {
        y: -2,
      },
      {
        y: 0,
        duration: 5,
      }
    );
    this.tl.fromTo(
      this.circle.circleMesh.position,
      {
        z: 0.05,
      },
      {
        z: 2,
        duration: 10,
        delay: 2,
      }
    );
    this.tl.fromTo(
      this.camera.position,
      {
        z: 4,
      },
      {
        z: 1,
        duration: 10,
      },
      "<"
    );
  }
  stepTwo() {
    this.tl.fromTo(
      this.singlePoint.material.uniforms.opacity,
      {
        value: 0,
      },
      {
        value: 1,
        duration: 20,
        delay: 4,
      },
      "<"
    );
  }

  stepThree() {
    this.tl.fromTo(
      this.points.pointsMaterial1.uniforms.opacity,
      {
        value: 0,
      },
      {
        value: 1,
        duration: 10,
        onComplete: () => this.points.addPoints(0, 10, this.points.pointsMaterial2, 20),
      }
    );

    this.tl.to(this.camera.position, {
      z: 30,
      duration: 30,
    });

    this.tl.fromTo(
      this.points.pointsMaterial2.uniforms.opacity,
      {
        value: 0,
      },
      {
        value: 1,
        duration: 10,
        onComplete: () => this.points.addPoints(10, 30, this.points.pointsMaterial3, 100),
      }
    );

    this.tl.fromTo(
      this.points.pointsMaterial3.uniforms.opacity,
      {
        value: 0,
      },
      {
        value: 1,
        duration: 40,
      }
    );
  }

  render() {
    this.time += 0.0005;
    this.tl.progress(this.time);
    this.tlText.progress(this.time * 2);

    this.singlePoint.events();

    window.requestAnimationFrame(this.render.bind(this));
  }

  eventListener() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "s") {
        document.body.classList.toggle("scroll");
      }
    });
  }
}
