import gsap from "gsap";
import Text from "./text";
import Circle from "./circle";
import SinglePoint from "./singlePoint";
import Points from "./points";
import Moon from "./moon/moon";
import Road from "./street/road";

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
    this.moon = new Moon({ scene: this.scene, gui: this.gui });
    this.road = new Road({ scene: this.scene, gui: this.gui });

    this.circle.init();
    this.singlePoint.init();
    this.points.init();
    this.moon.init();
    this.road.init();
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
    this.stepFour();
  }

  stepOne() {
    this.tl.fromTo(
      this.circle.circleMesh.position,
      {
        y: -2,
      },
      {
        y: 0,
        duration: 40,
      }
    );

    // ZOOM Circle
    this.tl.fromTo(
      this.circle.circleMesh.position,
      {
        z: 3.7,
      },
      {
        z: 6,
        duration: 200,
      }
    );
  }

  stepTwo() {
    const textPoints = document.querySelectorAll(".text__point");

    // FADE IN Single point
    this.tl.fromTo(
      this.singlePoint.material.uniforms.opacity,
      {
        value: 0,
      },
      {
        value: 1,
        duration: 20,
        delay: 10,
      },
      "<"
    );

    // FADE OUT Circle
    this.tl.fromTo(
      this.circle.material.uniforms.opacity,
      {
        value: 1,
      },
      {
        value: 0,
        duration: 20,
      },
      "<"
    );

    this.tl.to(
      textPoints[0],
      {
        opacity: 1,
        duration: 5,
        delay: 20,
      },
      "<"
    );

    // MOVE Single point + FADE IN Text
    this.tl.to(
      this.singlePoint.mesh.position,
      {
        x: this.singlePoint.positions[0].x,
        y: this.singlePoint.positions[0].y,
        duration: 5,
        delay: 10,
      },
      "<"
    );

    this.tl.to(
      textPoints[0],
      {
        opacity: 0,
        duration: 5,
        delay: 10,
      },
      "<"
    );

    this.tl.to(
      textPoints[1],
      {
        opacity: 1,
        duration: 5,
        delay: 10,
      },
      "<"
    );

    // MOVE Single point + FADE IN Text
    this.tl.to(
      this.singlePoint.mesh.position,
      {
        x: this.singlePoint.positions[1].x,
        y: this.singlePoint.positions[1].y,
        duration: 5,
        delay: 10,
      },
      "<"
    );

    this.tl.to(
      textPoints[1],
      {
        opacity: 0,
        duration: 5,
        delay: 10,
      },
      "<"
    );

    this.tl.to(
      textPoints[2],
      {
        opacity: 1,
        duration: 5,
        delay: 10,
      },
      "<"
    );

    // MOVE Single point + FADE IN Text
    this.tl.to(
      this.singlePoint.mesh.position,
      {
        x: this.singlePoint.positions[2].x,
        y: this.singlePoint.positions[2].y,
        duration: 5,
        delay: 10,
      },
      "<"
    );

    this.tl.to(
      textPoints[2],
      {
        opacity: 0,
        duration: 5,
        delay: 10,
      },
      "<"
    );

    this.tl.to(
      textPoints[3],
      {
        opacity: 1,
        duration: 5,
        delay: 10,
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

    this.tl.to(this.camera.position, {
      // z: 36,
      z: 63,
      duration: 50,
    });

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

  stepFour() {
    this.tl.to(this.camera.position, {
      z: 80,
      duration: 30,
    });

    this.tl.to(this.camera.position, {
      z: 95,
      duration: 20,
    });

    this.tl.to(
      this.camera.position,
      {
        //y: -40,
        // A REMETTRE / C ETAIT POUR LE SCROLL
        y: -53,
        duration: 20,
      },
      "<"
    );
  }

  render() {
    this.time += 0.0002;
    //this.progress = this.time;
    this.progress = this.scrollValue;

    this.tl.progress(this.progress);
    this.tlText.progress(this.progress * 8);

    window.requestAnimationFrame(this.render.bind(this));
  }

  eventListener() {
    document.body.classList.toggle("scroll");
    window.addEventListener("keydown", (e) => {
      if (e.key === "s") {
      }
    });
  }
}
