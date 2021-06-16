import Sketch from "./js/sketch.js";
import { gsap } from "gsap";

const startBtn = document.getElementById("start");
const homePage = document.querySelector(".home");

new Sketch({ dom: document.getElementById("container") });

const tl = gsap.timeline();
startBtn.addEventListener("click", () => {
  tl.to(".home__title", {
    autoAlpha: 0,
  });
  tl.to(".home", {
    duration: 2,
    autoAlpha: 0,
  });
});
