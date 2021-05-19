import * as THREE from "three";
import gsap from "gsap";

import fragment from "./shaders/textIntro/fragment.glsl";
import vertex from "./shaders/textIntro/vertex.glsl";

export default class TextIntro {
  constructor(options) {
    this.scene = options.scene;

    this.loader = new THREE.FontLoader();
    this.textureLoader = new THREE.TextureLoader();
    this.strengthValue = 1;

    this.textMaterial = null;

    this.materialsText = [];

    this.textLoaded = 0;
    this.allTextLoaded = false;

    this.textGroup = new THREE.Group();

    this.index = 0;
  }

  init() {
    this.addText();
  }

  animText(time) {
    console.log(time);
    const steps = [0, 0.06, 0.1, 0.15, 0.2, 0.25];

    steps.forEach((step, i) => {
      if (time > step && time < steps[i + 1]) {
        const currentText = this.materialsText[i];
        const otherTexts = this.materialsText.filter((el) => el !== currentText);

        // FADE IN currentText
        gsap.to(currentText.uniforms.opacity, {
          value: 1,
        });

        // FADE OUT otherTexts
        otherTexts.forEach((text) => {
          gsap.to(text.uniforms.opacity, {
            value: 0,
            onComplete: () => (this.animationFinished = true),
          });
        });
      }
    });
  }

  addText() {
    const texts = [
      "HOW DO I FORGIVE MYSELF FOR MY OWN MISTAKES ?",
      "COULD YOU POSSIBLY HELP ME UNDERSTAND ?",
      "WOULD YOU EVEN HOLD MY HAND SPEAKING SOFTLY IN MY HEAR ?",
      "COULD YOU POSSIBLY HELP ME",
      "PLEASE",
    ];
    this.loader.load("/fonts/Moniqa-Display_Bold.json", (font) => {
      if (this.index > texts.length - 1) {
        this.textGroup.position.z = -80;
        this.scene.add(this.textGroup);
        return;
      }
      const text = texts[this.index];
      this.createText(text, font, this.index).then(() => {
        this.index++;
        this.addText();
      });
    });
  }

  createText(text, font, index) {
    return new Promise((resolve, reject) => {
      const textGeometry = new THREE.TextGeometry(text, {
        font: font,
        size: 3.5,
        height: 0,
        curveSegments: 10,
        bevelEnabled: false,
      });

      const textMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uStrength: { value: 0 },
          time: { value: 0 },
          activeLines: { value: 0 },
          scroll: { value: 0 },
          opacity: { value: 0 },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
      });

      this.materialsText.push(textMaterial);

      const textMesh = new THREE.Mesh(textGeometry, this.materialsText[index]);

      textGeometry.center();

      this.textGroup.add(textMesh);
      if (textMesh) {
        setTimeout(() => {
          resolve();
        }, 100);
      }
    });
  }

  anim(time) {
    this.materialsText.forEach((material) => {
      material.uniforms.time.value = time;
      material.uniforms.activeLines.value = time * 0.01;
    });
  }
}
