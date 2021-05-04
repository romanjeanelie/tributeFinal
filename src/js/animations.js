import gsap from "gsap";
import Circle from "./circle";

export default class Animations {
  constructor(options) {
    this.camera = options.camera;
    this.objects = options.objects;

    this.circle = options.objects[0];
    this.singlePoint = options.objects[1];

    this.scrollValue = 0;

    this.circle;

    this.getScroll();
    this.positionCamera();
    this.anim();

    this.commands = {
      p: "paused",
      l: "play",
    };

    this.commandChecker();

    console.log(this.objects);
  }

  getScroll() {
    window.addEventListener("scroll", (e) => {
      this.scrollValue = window.scrollY / document.body.scrollHeight;
      console.log(this.scrollValue);
      this.anim();
    });
  }

  positionCamera() {
    this.camera.position.z = 2;
  }

  anim() {
    this.tl = gsap.timeline({
      //paused: true,
    });

    this.circle.anim(this.tl);
    this.singlePoint.anim(this.tl);

    this.tl.progress(this.scrollValue);
  }

  commandChecker() {
    Object.keys(this.commands).forEach((el) => {
      const key = el;
      const value = this.commands[el];
      window.addEventListener("keydown", (e) => {
        if (e.key === key) {
          this.tl[value](true);
        }
      });
    });
  }
}
