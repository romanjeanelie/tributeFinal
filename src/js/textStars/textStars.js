import * as THREE from "three";
import gsap from "gsap";

import fragment from "../shaders/textStars/fragment.glsl";
import vertex from "../shaders/textStars/vertex.glsl";

export default class TextStars {
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

    this.materialsText = [];

    this.index = 0;
  }

  init() {
    this.texts = [
      {
        text: "your lips are so sweet",
        posX: -6,
        posY: -818,
        posZ: -300,
        scale: 10,
        color: "#fff",
      },
      {
        text: "they keep running on my feet",
        posX: -6,
        posY: -1500,
        posZ: -300,
        scale: 15,
        color: "#fff",
      },
      {
        text: "it helped the days complete",
        posX: -6,
        posY: -2300,
        posZ: -300,
        scale: 25,
        color: "#fff",
      },
      {
        text: "don't get hurt",
        posX: -1500,
        posY: -3000,
        posZ: -150,
        scale: 40,
        color: "#fff",
      },
      {
        text: "I'm lock in your dreams",
        posX: -6,
        posY: -5000,
        posZ: -600,
        scale: 180,
        color: "#EE31C3",
      },
    ];
    this.loader.load("/fonts/Moniqa-Display_Italic.json", (font) => {
      this.texts.forEach((textOptions) => {
        this.createText(font, textOptions);
      });
    });
  }

  createText(font, options) {
    const textGeometry = new THREE.TextGeometry(options.text, {
      font: font,
      size: 1,
      height: 0,
      curveSegments: 10,
      bevelEnabled: false,
    });

    const textMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uStrength: { value: 0 },
        time: { value: 0 },
        activeLines: { value: 0 },
        progress: { value: 0 },
        opacity: { value: 1 },
        uColor: { value: new THREE.Color(options.color) },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
    });

    this.materialsText.push(textMaterial);

    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    textMesh.position.x = options.posX;
    textMesh.position.y = options.posY;
    textMesh.position.z = options.posZ;
    textMesh.scale.set(options.scale, options.scale, options.scale);

    textGeometry.center();

    this.scene.add(textMesh);
  }

  anim(progress, time) {
    this.materialsText.forEach((material) => {
      material.uniforms.time.value = time;
      material.uniforms.progress.value = progress;
      // SPEED Volets
      const velocity = progress * 0.1;
      material.uniforms.activeLines.value = progress;
    });
  }
}
