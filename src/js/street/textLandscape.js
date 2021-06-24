import * as THREE from "three";
import gsap from "gsap";

import fragment from "../shaders/textsLandscape/text1/fragment.glsl";
import vertex from "../shaders/textsLandscape/text1/vertex.glsl";

export default class TextLandscape {
  constructor(options) {
    this.scene = options.scene;

    this.loader = new THREE.FontLoader();

    this.materialsText = [];

    this.textLoaded = 0;
    this.allTextLoaded = false;

    this.textGroup1 = new THREE.Group();
    this.textGroup2 = new THREE.Group();

    this.opacity = { value: 0 };
    this.isLoaded = false;

    this.index1 = 0;
    this.index2 = 0;
  }

  addText1(optionsPositions) {
    const texts = ["THERE'S A REASON", "WE ARE TOGETHER"];
    this.loader.load("/fonts/Oswald_Regular.json", (font) => {
      if (this.index1 > texts.length - 1) {
        this.textGroup1.position.x = optionsPositions.x + 80;
        this.textGroup1.position.y = optionsPositions.y + 10;
        this.textGroup1.position.z = optionsPositions.z + 200;

        this.textGroup1.scale.set(0.2, 0.2, 0.2);
        // Position
        this.textGroup1.children[0].position.y = 30;
        this.textGroup1.children[1].position.y = 0;
        // this.textGroup1.children[2].position.y = -30;
        this.scene.add(this.textGroup1);
        this.isLoaded = true;
        return;
      }
      const text = texts[this.index1];
      this.createText(text, font, this.index1, this.textGroup1).then(() => {
        this.index1++;
        this.addText1(optionsPositions);
      });
    });
  }

  addText2(optionsPositions) {
    const texts = ["I KNOW YOU'RE DREAMING"];
    this.loader.load("/fonts/Moniqa-ExtBold_Italic.json", (font) => {
      if (this.index2 === texts.length) {
        this.textGroup2.position.x = optionsPositions.x + 150;
        this.textGroup2.position.y = optionsPositions.y + 200;
        this.textGroup2.position.z = optionsPositions.z + 0;

        this.textGroup2.scale.set(0.7, 0.7, 0.7);
        // Position
        this.textGroup2.children[0].position.y = 20;
        this.scene.add(this.textGroup2);
        this.isLoaded = true;
        return;
      }
      const text = texts[this.index2];
      this.createText(text, font, this.index2, this.textGroup2).then(() => {
        this.index2++;
        this.addText2(optionsPositions);
      });
    });
  }

  createText(text, font, index, textGroup) {
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

      // textGeometry.center();
      textGroup.add(textMesh);
      if (textMesh) {
        resolve();
      }
    });
  }

  anim(progress, time) {
    this.materialsText.forEach((material) => {
      material.uniforms.time.value = time;
      material.uniforms.progress.value = progress;

      material.uniforms.opacity.value = this.opacity.value;
    });
  }
}
