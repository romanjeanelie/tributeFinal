import * as THREE from "three";
import gsap from "gsap";

import fragment from "./shaders/textFinal/fragment.glsl";
import vertex from "./shaders/textFinal/vertex.glsl";

export default class TextFinal {
  constructor(options) {
    this.scene = options.scene;

    this.loadingManager = options.loadingManager;
    this.loader = new THREE.FontLoader(this.loadingManager);
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
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
    const texts = ["I CAN'T GET YOU OUT OF MY HEAD", "I'M SUFFOCATED"];
    this.loader.load("/fonts/Moniqa-ExtBold.json", (font) => {
      if (this.index > texts.length - 1) {
        this.textGroup.position.y = 2500;
        this.textGroup.position.z = 0;

        this.textGroup.scale.set(750, 750, 750);
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
          opacity: { value: 0 },
          uColor1: { value: new THREE.Color("#CEC98B") },
          uColor2: { value: new THREE.Color("#8D773D") },
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
    });
  }
}
