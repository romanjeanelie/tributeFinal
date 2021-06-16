import Sketch from "./js/sketch.js";
import { gsap } from "gsap";

const startBtn = document.getElementById("start");

new Sketch({ dom: document.getElementById("container") });

const tlScroll = gsap.timeline({
  repeat: 2,
  paused: true,
});
tlScroll.to(".scroll__bar", {
  scaleY: 1,
});

tlScroll.to(".scroll__bar", {
  transformOrigin: "bottom",
  scaleY: 0,
});
tlScroll.to(".scroll__bar", {
  transformOrigin: "top",
  scaleY: 0.2,
});

const tl = gsap.timeline();
startBtn.addEventListener("click", () => {
  tl.to(".home__title", {
    autoAlpha: 0,
  });
  tl.to(".home", {
    duration: 2,
    autoAlpha: 0,
  });
  tl.to(".home__help", {
    duration: 1,
    autoAlpha: 1,
    onComplete: () => tlScroll.play(),
  });
});
