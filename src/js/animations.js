import gsap from "gsap";

export default class Animations {
  constructor(options) {
    this.time = 0;

    this.camera = options.camera;
    this.objects = options.objects;

    this.circle = options.objects[0];
    this.singlePoint = options.objects[1];
    this.textIntro = options.objects[2];
    this.points = options.objects[3];

    this.scrollValue = 0;

    this.tl = gsap.timeline({
      paused: true,
    });

    this.tlText = gsap.timeline({
      paused: true,
    });

    this.tlCamera = gsap.timeline({
      paused: true,
    });

    this.getScroll();

    this.render();

    this.eventListener();
  }

  getScroll() {
    window.addEventListener("scroll", (e) => {
      this.scrollValue = window.scrollY / document.body.scrollHeight;
      console.log(this.scrollValue);
    });
  }

  anim() {
    this.animCamera();
    this.animObjects();

    //    this.tl.progress(this.scrollValue);
    //this.tlText.progress(this.scrollValue);
  }

  animCamera() {
    this.tlCamera.fromTo(
      this.camera.position,
      {
        z: 2,
      },
      {
        z: 1,
        duration: 10,
        delay: 4,
      }
    );
  }

  animObjects() {
    this.circle.anim(this.tl);
    this.singlePoint.anim(this.tl);
    this.textIntro.anim(this.tlText);
    this.points.anim(this.tl);
  }

  render() {
    this.time += 0.0005;
    this.tl.progress(this.time);
    this.tlCamera.progress(this.time);
    this.tlText.progress(this.time);

    // this.tl.progress(this.scrollValue);
    // this.tlCamera.progress(this.scrollValue);

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
