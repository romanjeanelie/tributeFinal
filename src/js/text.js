export default class Text {
  constructor(options) {
    this.scene = options.scene;

    this.text = [
      {
        text: "how do I forgive myself for my own mistakes ?",
      },
      { text: "could you possibly help me understand ?", fadeIn: 10 },
      { text: "would you even hold my hand speakling softly in my hear ?" },
      { text: "please", delayOut: 10 },
    ];

    this.addText();
  }

  addText() {
    this.text.forEach((el) => {
      this.createText(el.text);
    });
  }

  createText(text) {
    const textEl = document.createElement("p");
    textEl.innerText = text;
    textEl.classList.add("text__intro");
    document.body.appendChild(textEl);
  }

  anim(tl) {
    const textEls = document.querySelectorAll(".text__intro");

    textEls.forEach((text, i) => {
      const fadeIn = this.text[i].fadeIn;
      const fadeOut = this.text[i].fadeOut;

      const delayOut = this.text[i].delayOut;

      // FADE IN Text
      tl.fromTo(
        text,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: fadeIn ? fadeIn : 2,
        }
      );

      // FADE OUT Text
      tl.to(text, {
        opacity: 0,
        duration: fadeOut ? fadeOut : 2,
        delay: delayOut ? delayOut : 0,
      });
    });
  }
}
