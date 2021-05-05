export default class TextIntro {
  constructor(options) {
    this.scene = options.scene;

    this.text = [
      {
        text: "how do I forgive myself for my own mistakes ?",
      },
      { text: "could you possibly help me understand ?", fadeIn: 10 },
      { text: "would you even hold my hand speakling softly in my hear ?" },
      { text: "please" },
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
      tl.to(text, {
        opacity: 0,
        duration: fadeOut ? fadeOut : 2,
      });
    });
  }
}
