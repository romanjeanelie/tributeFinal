import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(SplitText, DrawSVGPlugin);

export default class Message {
  constructor() {
    this.tlAppear = gsap.timeline({ paused: true, onComplete: () => this.tlType.play() });

    this.tlType = gsap.timeline({
      paused: true,
      delay: 1,
      onComplete: () =>
        setTimeout(() => {
          this.sendMessage();
        }, 2000),
    });

    this.init();
  }

  init() {
    this.writeMessage();
    this.appearWindow();
  }

  anim() {
    this.tlAppear.play();
  }

  appearWindow() {
    const duration = 10;
    this.tlAppear.fromTo(".window__rect #rect", { drawSVG: "0%" }, { delay: 2, duration: duration, drawSVG: "100%" });

    this.tlAppear.fromTo(".window__top .line", { scaleX: 0 }, { delay: 2, duration: duration, scaleX: 1 }, "<");

    this.tlAppear.fromTo(".window__top__wrapper", { opacity: 0 }, { delay: 2, duration: duration, opacity: 1 }, "<");

    this.tlAppear.fromTo(".window__messages", { opacity: 0 }, { delay: 2, duration: duration, opacity: 1 }, "<");

    this.tlAppear.fromTo(".input", { opacity: 0 }, { delay: 2, duration: duration, opacity: 1 }, "<");
  }

  writeMessage() {
    this.splitText = new SplitText("#type", { type: "words,chars" });
    this.chars = this.splitText.chars;

    this.chars.forEach((letter) => {
      this.tlType.fromTo(
        letter,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.01,
          delay: Math.random() * 0.4,
        }
      );
    });
  }

  sendMessage() {
    const inputText = document.querySelector(".input .text");
    const messagesEl = document.querySelector(".window__messages__wrapper");

    inputText.style.opacity = 0;

    messagesEl.innerHTML += `
       <div class="message">
              <p class="message__date">11 juil 2021</p>
              <p class="message__text">Here is the gift: wwww.tributetobeau.com (sorry for the late)</p>
            </div>
      `;
  }
}
