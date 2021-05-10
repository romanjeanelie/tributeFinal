export default class Text {
  constructor(options) {
    this.scene = options.scene;

    this.textIntro = [
      {
        text: "how do I forgive myself for my own mistakes ?",
        class: "text__intro",
        delayIn: 2,
      },
      {
        text: "could you possibly help me understand ?",
        class: "text__intro",
      },
      {
        text: "would you even hold my hand speakling softly in my hear ?",
        class: "text__intro",
        fadeIn: 24,
        fadeOut: 24,
      },
      {
        text: "could you possibly help me ?",
        class: "text__intro",
        delayIn: -4,
        fadeIn: 10,
        fadeOut: 10,
      },
      { text: "please", class: "text__intro", delayIn: -10, delayOut: 0, fadeOut: 13 },
    ];
    this.textPoints = [
      { text: "Oh life is a grain of salt in the eyes of god", class: ["text__point", "god"], delayIn: 5 },
      { text: "There's a Reason we are together", class: "text__point" },
      { text: "TAKE ME BACK", class: "text__point" },
      { text: "catch me in the moment when you said you love me", class: "text__point" },
    ];

    this.addText();
  }

  addText() {
    this.textIntro.forEach((el) => {
      this.createText(el.text, el.class);
    });
    this.textPoints.forEach((el) => {
      this.createText(el.text, el.class);
    });
  }

  createText(text, className) {
    const textEl = document.createElement("p");
    textEl.classList.add("text");
    if (typeof className === "object") {
      className.forEach((el) => {
        textEl.classList.add(el);
      });
    } else {
      textEl.classList.add(className);
    }
    textEl.innerText = text;
    document.body.appendChild(textEl);
  }

  anim(tl) {
    const textEls = document.querySelectorAll(".text__intro");

    textEls.forEach((text, i) => {
      const fadeIn = this.textIntro[i].fadeIn;
      const fadeOut = this.textIntro[i].fadeOut;

      const delayIn = this.textIntro[i].delayIn;
      const delayOut = this.textIntro[i].delayOut;

      // FADE IN Text
      tl.fromTo(
        text,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: fadeIn ? fadeIn : 16,
          delay: delayIn ? delayIn : -8,
        },
        "<"
      );

      // FADE OUT Text
      tl.to(text, {
        opacity: 0,
        duration: fadeOut ? fadeOut : 14,
        delay: delayOut ? delayOut : 0,
      });
    });
  }
}
