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

    this.textsMesh = [];
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
        scale: 20,
        color: "#FEED3A",
        color2: "#F41B0C",
        opacity: 1,
      },
      {
        text: "they keep running on my feet",
        posX: -6,
        posY: -1500,
        posZ: -300,
        // scale: 15,
        scale: 20,
        color: "#FFD316",
        color2: "#EF8E29",
        opacity: 1,
      },
      {
        text: "it helped the days complete",
        posX: -6,
        posY: -2300,
        posZ: -300,
        // scale: 25,
        scale: 30,
        color: "#3516F8",
        color2: "#FF00DE",
        opacity: 1,
      },
      {
        text: "I'm lock in your dreams",
        posX: -6,
        posY: -3800,
        posZ: -600,
        scale: 80,
        color: "#FF00DE",
        color2: "#2300FF",
        opacity: 1,
      },
      {
        text: "don't get hurt",
        posX: -700,
        posY: -4100,
        posZ: 10600,
        scale: 100,
        color: "#FFF145",
        color2: "#EA1505",
        opacity: 1,
      },

      // {
      //   text: "There's a reason we're together",
      //   posX: 11000,
      //   // posX: 250000, ////// DEBUG
      //   posY: 6000,
      //   posZ: 30600,
      //   rotY: Math.PI,
      //   scale: 1000,
      //   color: "#E90405",
      // },
    ];
    this.loader.load("/fonts/Moniqa-Display_Italic.json", (font) => {
      this.texts.forEach((textOptions) => {
        this.createText(font, textOptions).then(() => {
          this.index++;

          if (this.index === this.texts.length) {
            this.allTextLoaded = true;
          }
        });
      });
    });
  }

  createText(font, options) {
    return new Promise((resolve, reject) => {
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
          opacity: { value: options.opacity },
          uColor: { value: new THREE.Color(options.color) },
          uColor2: { value: new THREE.Color(options.color2 ? options.color2 : options.color) },
          squeeze: { value: 0 },
          wide: { value: 1 },
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

      if (options.rotY) {
        textMesh.rotation.y = options.rotY;
      }
      textMesh.scale.set(options.scale, options.scale, options.scale);

      this.textsMesh.push(textMesh);

      textGeometry.center();

      this.scene.add(textMesh);

      if (textMesh) {
        resolve();
      }
    });
  }

  anim(progress, time) {
    this.materialsText.forEach((material, i) => {
      material.uniforms.time.value = time;
      material.uniforms.progress.value = progress;
      // SPEED Volets
      material.uniforms.activeLines.value = progress;
    });
  }
}
