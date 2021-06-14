import * as THREE from "three";
import gsap from "gsap";

import fragment from "./shaders/textGod/fragment.glsl";
import vertex from "./shaders/textGod/vertex.glsl";

export default class TextGod {
  constructor(options) {
    this.gui = options.gui;
    this.debugObject = {};

    this.scene = options.scene;

    this.loader = new THREE.FontLoader();
    this.textureLoader = new THREE.TextureLoader();
    this.strengthValue = 1;

    this.textMaterial = null;

    this.materialsText = [];

    this.textLoaded = 0;
    this.allTextLoaded = false;

    this.textGroup = new THREE.Group();

    this.opacity = { value: 0 };

    this.index = 0;
  }

  init() {
    this.addText();
  }

  addText() {
    const texts = ["OH LIFE IS A GRAIN OF SALT", "IN THE EYES OF GOD"];
    this.loader.load("/fonts/Oswald_Regular.json", (font) => {
      if (this.index > texts.length - 1) {
        this.textGroup.position.z = -80;
        // Position
        this.textGroup.children[0].position.y = 20;
        this.textGroup.children[1].position.y = -20;
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
        size: 20,
        height: 0,
        curveSegments: 10,
        bevelEnabled: false,
      });

      const textMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          activeLines: { value: 0 },
          progress: { value: 0 },
          opacity: { value: 0 },
          uColor: { value: new THREE.Color("#ffffff") },
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

  anim(progress, time) {
    this.materialsText.forEach((material) => {
      material.uniforms.time.value = time;
      material.uniforms.progress.value = progress;

      material.uniforms.opacity.value = this.opacity.value;
      material.uniforms.activeLines.value = progress;
    });
  }
}
