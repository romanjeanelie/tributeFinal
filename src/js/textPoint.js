import * as THREE from "three";
import gsap from "gsap";

import fragment from "./shaders/textIntro/fragment.glsl";
import vertex from "./shaders/textIntro/vertex.glsl";
// import fragment from "./shaders/textPoint/fragment.glsl";
// import vertex from "./shaders/textPoint/vertex.glsl";

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

    this.indexAnim = 0;
    this.animComplete = true;
  }

  init() {
    this.addText();
  }

  addText() {
    const texts = [
      "THERE'S A REASON WE ARE TOGETHER",
      "take me back",
      "catch me in the moment when you said you loved me",
    ];
    this.loader.load("/fonts/Oswald_Regular.json", (font) => {
      if (this.index > texts.length - 1) {
        this.textGroup.position.y = 0;
        this.textGroup.position.z = -80;

        this.textGroup.scale.set(1, 1, 1);
        this.scene.add(this.textGroup);
        this.materialsText[0].uniforms.progress.value = 1;
        this.materialsText[0].uniforms.opacity.value = 1;
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

      // const textMaterial = new THREE.ShaderMaterial({
      //   uniforms: {
      //     uStrength: { value: 0 },
      //     time: { value: 0 },
      //     progress: { value: 0 },
      //     opacity: { value: 0 },
      //     color1: { value: new THREE.Color("#FF0000") },
      //   },

      const textMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uStrength: { value: 0 },
          time: { value: 0 },
          activeLines: { value: 0 },
          progress: { value: 0 },
          opacity: { value: 0 },
          uColor: { value: new THREE.Color("#93ADFF") },
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

  animText(index) {
    console.log(index);
    console.log(this.materialsText[0]);
    this.animComplete = false;
    1;
    if (this.materialsText[index - 1]) {
      gsap.to(this.materialsText[index - 1].uniforms.progress, {
        value: 2.8,
        duration: 2,
      });
      gsap.to(this.materialsText[index - 1].uniforms.opacity, {
        value: 0,
        duration: 2,
      });
    }

    if (this.materialsText[index]) {
      gsap.to(this.materialsText[index].uniforms.opacity, {
        value: 1,
        duration: 2,
      });
      gsap.to(this.materialsText[index].uniforms.progress, {
        value: 1,
        duration: 2,
        onComplete: () => (this.animComplete = true),
      });
    }
  }

  anim(progress, time) {
    this.materialsText.forEach((material) => {
      material.uniforms.time.value = time;
      material.uniforms.progress.value = time;
      material.uniforms.activeLines.value = time * 10;
    });
  }
}
