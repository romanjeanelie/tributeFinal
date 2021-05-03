import gsap from "gsap";

export default class Animations {
  constructor(options) {
    console.log("animations");
    this.camera = options.camera;
    this.initialPositionZ = 1;
    this.scrollValue = 0;

    this.getScroll();
    this.anim();
  }

  getScroll() {
    window.addEventListener("scroll", (e) => {
      this.scrollValue = window.scrollY / document.body.scrollHeight;
      console.log(this.scrollValue);
      this.animCamera();
    });
  }

  anim() {
    this.animCamera();
  }
  animCamera() {
    gsap.fromTo(
      this.camera.position,
      {
        z: this.initialPositionZ,
      },
      {
        z: 3,
        duration: 10,
        //   paused: true,
      }
    );
    //   .progress(this.scrollValue);
  }
}
