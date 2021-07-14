import * as THREE from "three";
import gsap from "gsap";

import fragment from "./shaders/textGod/fragment.glsl";
import vertex from "./shaders/textGod/vertex.glsl";

export default class TextGod {
  constructor(options) {
    this.gui = options.gui;
    this.debugObject = {};
    this.folderGod = this.gui.addFolder("TextGod");
    this.folderGod.open();

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
    this.squeeze = { value: 1 };
    this.isLoaded = false;

    this.index = 0;
  }

  init() {
    this.addText();
  }

  addText() {
    this.debugObject.color = "#ecc120";

    this.folderGod.addColor(this.debugObject, "color").onChange(() => {
      this.materialsText.forEach((material) => {
        material.uniforms.uColor.value = new THREE.Color(this.debugObject.color);
      });
    });
    const texts = ["LIFE IS A GRAIN OF SALT IN THE EYES OF GOD", ""];
    this.loader.load("/fonts/Moniqa-ExtBold_Italic.json", (font) => {
      if (this.index > texts.length - 1) {
        // Position
        this.textGroup.rotation.x = Math.PI;
        this.textGroup.position.y = -2000;
        this.textGroup.position.z = -2000;
        this.textGroup.children[0].position.y = 20;
        this.textGroup.children[1].position.y = -20;
        this.textGroup.scale.set(25, 25, 25);

        this.scene.add(this.textGroup);
        this.isLoaded = true;
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
          progress: { value: -13 },
          opacity: { value: this.opacity },
          squeeze: { value: this.squeeze },
          uColor: { value: new THREE.Color(this.debugObject.color) },
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
        resolve();
      }
    });
  }

  anim(progress, time) {
    this.materialsText.forEach((material) => {
      material.uniforms.time.value = time;
      // material.uniforms.progress.value = progress;

      material.uniforms.opacity.value = this.opacity.value;
      material.uniforms.squeeze.value = this.squeeze.value;
      material.uniforms.activeLines.value = progress;
    });
  }
}
