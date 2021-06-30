import * as THREE from "three";
import gsap from "gsap";

import fragment from "./shaders/textPoint/fragment.glsl";
import vertex from "./shaders/textPoint/vertex.glsl";

export default class TextPoint {
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

  animText(i) {
    const currentText = this.materialsText[i];
    const otherTexts = this.materialsText.filter((el) => el !== currentText);

    // FADE IN currentText
    if (currentText) {
      gsap.to(currentText.uniforms.opacity, {
        value: 1,
      });
    }

    // FADE OUT otherTexts
    otherTexts.forEach((text) => {
      gsap.to(text.uniforms.opacity, {
        value: 0,
      });
    });
  }

  addText() {
    const texts = [
      "there's a reason we are together",
      "take me back",
      "catch me in the moment when you said you loved me",
    ];
    this.loader.load("/fonts/Soleil_Regular.json", (font) => {
      if (this.index > texts.length - 1) {
        this.textGroup.position.y = -25;
        this.textGroup.position.z = -80;

        this.textGroup.scale.set(0.7, 0.7, 0.7);
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
        size: 3,
        height: 0,
        curveSegments: 10,
        bevelEnabled: false,
      });

      const textMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uStrength: { value: 0 },
          time: { value: 0 },
          progress: { value: 0 },
          opacity: { value: 0 },
          color1: { value: new THREE.Color("#FF0000") },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
      });

      this.materialsText.push(textMaterial);

      const textMesh = new THREE.Mesh(textGeometry, this.materialsText[index]);

      textGeometry.center();

      this.textGroup.add(textMesh);
      if (textMesh) {
        resolve();
      }
    });
  }

  anim(progress, time) {
    this.materialsText.forEach((material) => {
      material.uniforms.time.value = time;
      material.uniforms.progress.value = progress;
    });
  }
}
