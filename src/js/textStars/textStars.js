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
        // scale: 10,
        scale: 10,
        color: "#FF00BB",
      },
      {
        text: "they keep running on my feet",
        posX: -6,
        posY: -1500,
        posZ: -300,
        // scale: 15,
        scale: 10,
        color: "#FF00BB",
      },
      {
        text: "it helped the days complete",
        posX: -6,
        posY: -2300,
        posZ: -300,
        // scale: 25,
        scale: 20,
        color: "#FF00BB",
        color2: "#2200D7",
      },
      {
        text: "don't get hurt",
        posX: -1200,
        posY: -5100,
        posZ: -600,
        scale: 40,
        color: "#Ffffff",
      },
      {
        text: "I'm lock in your dreams",
        posX: -6,
        posY: -3500,
        posZ: -600,
        scale: 180,
        color: "#EE31C3",
      },
      // {
      //   text: "You got the melody and the words",
      //   posX: 7000,
      //   // posX: 250000, ////// DEBUG
      //   posY: 2500,
      //   posZ: 18600,
      //   scale: 800,
      //   color: "#E90405",
      // },
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
        uColor2: { value: new THREE.Color(options.color2 ? options.color2 : options.color) },
        squeeze: { value: 0 },
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

  anim(progress, time, scrollSpeed) {
    this.materialsText.forEach((material) => {
      material.uniforms.time.value = time;
      material.uniforms.progress.value = progress;
      // SPEED Volets
      material.uniforms.activeLines.value = progress;
      material.uniforms.squeeze.value = Math.abs(scrollSpeed);
    });
  }
}
