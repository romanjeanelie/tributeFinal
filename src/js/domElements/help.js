import gsap from "gsap/gsap-core";

import debounce from "../utils/debounce";

export default class Help {
  constructor() {
    this.scroll;
    this.activeScroll = true;
  }

  active() {
    gsap.to(".help", {
      autoAlpha: 0, //////////////////// DISABLE HELP
    });
  }
  inactive() {
    gsap.to(".help", {
      autoAlpha: 0,
    });
  }

  displayClick() {
    gsap.to(".help__click .desktop", {
      y: 0,
      duration: 2,
      ease: "expo.out",
    });
  }

  hideClick() {
    gsap.to(".help__click .desktop", {
      y: "-100%",
      duration: 2,
      ease: "expo.out",
    });
  }

  displayScroll1() {
    gsap.to(".help__scroll .scroll1", {
      y: 0,
      duration: 2,
      ease: "expo.out",
    });
  }
  hideScroll1() {
    gsap.to(".help__scroll .scroll1", {
      y: "-100%",
      duration: 2,
      ease: "expo.out",
    });
  }

  displayScroll2() {
    gsap.to(".help__scroll .scroll2", {
      y: 0,
      duration: 2,
      ease: "expo.out",
    });
  }
  hideScroll2() {
    gsap.to(".help__scroll .scroll2", {
      y: "-100%",
      duration: 2,
      ease: "expo.out",
    });
  }

  displayPlay() {
    console.log("display help play");
    gsap.to(".help__play p", {
      y: 0,
      duration: 2,
      ease: "expo.out",
    });
  }

  hidePlay() {
    gsap.to(".help__play p", {
      y: "-100%",
      duration: 2,
      ease: "expo.out",
    });
  }
}
