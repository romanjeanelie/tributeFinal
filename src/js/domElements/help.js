import gsap from "gsap/gsap-core";

import debounce from "../utils/debounce";

export default class Help {
  constructor() {
    this.scroll;
    this.activeScroll = true;

    console.log("help");
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
    console.log("display click");
    gsap.to(".help__click .desktop", {
      y: 0,
      duration: 2,
      ease: "expo.out",
    });
  }

  hideClick() {
    console.log("hide click");
    gsap.to(".help__click .desktop", {
      y: "-100%",
      duration: 2,
      ease: "expo.out",
    });
  }

  displayScroll1() {
    console.log("display scroll1");
    gsap.to(".help__scroll .scroll1", {
      y: 0,
      duration: 2,
      ease: "expo.out",
    });
  }
  hideScroll1() {
    console.log("hide scroll1");
    gsap.to(".help__scroll .scroll1", {
      y: "-100%",
      duration: 2,
      ease: "expo.out",
    });
  }

  displayScroll2() {
    console.log("display scroll2");
    gsap.to(".help__scroll .scroll2", {
      y: 0,
      duration: 2,
      ease: "expo.out",
    });
  }
  hideScroll2() {
    console.log("hide scroll2");
    gsap.to(".help__scroll .scroll2", {
      y: "-100%",
      duration: 2,
      ease: "expo.out",
    });
  }
}
