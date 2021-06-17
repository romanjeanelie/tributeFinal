import gsap from "gsap/gsap-core";

export default class Help {
  constructor() {
    this.waitDuration = 7000;
  }

  active() {
    gsap.to(".help", {
      autoAlpha: 1,
    });
  }
  inactive() {
    gsap.to(".help", {
      autoAlpha: 0,
    });
  }

  scroll() {
    this.tlScroll = gsap.timeline({
      delay: 1,
      repeat: 2,
      onComplete: () => {
        gsap.to(".help", {
          autoAlpha: 0,
        });
      },
    });
    this.tlScroll.to(".scroll__bar", {
      scaleY: 1,
    });

    this.tlScroll.to(".scroll__bar", {
      transformOrigin: "bottom",
      scaleY: 0,
    });
    this.tlScroll.to(".scroll__bar", {
      transformOrigin: "top",
      scaleY: 0.2,
    });
  }
}
