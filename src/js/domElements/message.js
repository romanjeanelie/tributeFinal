import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(SplitText, DrawSVGPlugin);

export default class Message {
  constructor() {
    this.tlAppear = gsap.timeline({ paused: true });
    this.init();
  }

  init() {
    this.tlAppear.fromTo(
      ".new-message .message__text",
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 20,
      },
      "<"
    );
    this.tlAppear.fromTo(
      ".new-message .message__date",
      {
        opacity: 0,
      },
      {
        opacity: 0.3,
        duration: 10,
      },
      "<"
    );
    this.tlAppear.fromTo(
      ".window__top",
      {
        opacity: 0,
      },
      {
        opacity: 0.3,
        duration: 10,
      },
      "<"
    );
    this.tlAppear.fromTo(
      ".old-message",
      {
        opacity: 0,
      },
      {
        opacity: 0.3,
        duration: 10,
      },
      "<"
    );
  }

  anim() {
    this.tlAppear.play();
  }
}
