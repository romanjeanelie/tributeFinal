import gsap from "gsap/gsap-core";
import * as THREE from "three";

import TextStars from "./textStars/textStars";
import Points from "./points";

import fragment from "./shaders/singlePoint/fragment.glsl";
import vertex from "./shaders/singlePoint/vertex.glsl";
import fragmentBG from "./shaders/singlePoint/fragmentBG.glsl";
import vertexBG from "./shaders/singlePoint/vertexBG.glsl";

import clamp from "./utils/clamp";

export default class SinglePoint {
  constructor(options) {
    this.gui = options.gui;
    this.debugObject = {};

    this.activeWave = { value: 0 };

    this.scene = options.scene;
    this.positionCamera = options.positionCamera;
    this.sizes = options.sizes;

    this.points = new Points({ scene: this.scene, gui: this.gui });
    this.textStars = new TextStars({ scene: this.scene });

    this.positionX = 0;
    this.positionY = { value: 0 };
    this.positionZ = -130;
  }

  init() {
    this.textStars.init();
    this.points.color1 = new THREE.Color("#ddd");
    this.points.color2 = new THREE.Color(this.textStars.texts[0].color);
    this.points.color3 = new THREE.Color(this.textStars.texts[1].color);
    this.points.color4 = new THREE.Color(this.textStars.texts[2].color);
    this.points.color5 = new THREE.Color(this.textStars.texts[3].color);
    this.points.init();

    this.setColors();
    this.createPoint();
    this.createBackground();

    this.updatePosition();
  }

  createPoint() {
    this.geometry = new THREE.PlaneGeometry(0.2, 0.2, 1, 1);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(this.points.color1) },
        color2: { value: new THREE.Color(this.textStars.texts[0].color) },
        color3: { value: new THREE.Color(this.textStars.texts[1].color) },
        color4: { value: new THREE.Color(this.textStars.texts[2].color) },
        color5: { value: new THREE.Color(this.textStars.texts[3].color) },
        colorOrb: { value: new THREE.Color("#F41B0C") },
        isColor1: { value: 1 },
        isColor2: { value: 0 },
        isColor3: { value: 0 },
        isColor4: { value: 0 },
        isColor5: { value: 0 },
        opacity: { value: 0 },
        isPressed: { value: 2.5 },
        uResolution: { value: new THREE.Vector2(this.sizes.width, this.sizes.height) },
      },
      side: THREE.DoubleSide,
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.position.x = this.positionX;
    this.mesh.position.y = this.positionY.value;
    this.mesh.position.z = this.positionZ;

    this.mesh.scale.set(40, 40, 40);

    this.scene.add(this.mesh);
  }

  createBackground() {
    this.geometryBG = new THREE.PlaneGeometry(1, 1);
    this.materialBG = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(this.debugObject.color1) },
        opacity: { value: 1 },
        wide: { value: 0 },
        isPressed: { value: 1 },
      },
      side: THREE.DoubleSide,
      vertexShader: vertexBG,
      fragmentShader: fragmentBG,
      transparent: true,
      depthWrite: false,
    });

    this.background = new THREE.Mesh(this.geometryBG, this.materialBG);

    this.background.position.x = this.positionX;
    this.background.position.y = this.positionY.value;
    this.background.position.z = this.positionZ - 10;

    this.background.scale.set(500, 500, 1);

    // this.scene.add(this.background);
  }

  setColors() {
    this.debugObject.color1 = "#FF0057";
    this.gui
      .addColor(this.debugObject, "color1")
      .onChange(() => (this.material.uniforms.color1.value = new THREE.Color(this.debugObject.color1)))
      .name("singlePointColor");
    this.debugObject.colorBG = "#000064";
    this.gui
      .addColor(this.debugObject, "colorBG")
      .onChange(() => (this.materialBG.uniforms.color1.value = new THREE.Color(this.debugObject.colorBG)))
      .name("singleBGPointColor");
  }

  updatePosition() {
    this.mesh.position.y = this.positionCamera.y;
    const deltas = [];
    const posTexts = [];

    window.addEventListener("scroll", () => {
      const posPoint = this.mesh.position.y;
      gsap.to(this.positionY, {
        value: this.positionCamera.y,
        duration: 2,
        ease: "back.out(4)",
      });
      if (this.textStars.allTextLoaded) {
        this.textStars.materialsText.forEach((material, i) => {
          posTexts[i] = this.textStars.texts[i].posY;
          deltas[i] = clamp((posPoint - posTexts[i]) / 300, 0, 1);
        });
      }
      this.material.uniforms.isColor1.value = deltas[0];
      this.material.uniforms.isColor2.value = 1 - deltas[0];
      this.points.pointsMaterial.uniforms.isColor1.value = deltas[0];
      this.points.pointsMaterial.uniforms.isColor2.value = 1 - deltas[0];
      if (posPoint < posTexts[0]) {
        this.material.uniforms.isColor2.value = deltas[1];
        this.material.uniforms.isColor3.value = 1 - deltas[1];
        this.points.pointsMaterial.uniforms.isColor2.value = deltas[1];
        this.points.pointsMaterial.uniforms.isColor3.value = 1 - deltas[1];
      }
      if (posPoint < posTexts[1]) {
        this.material.uniforms.isColor3.value = deltas[2];
        this.material.uniforms.isColor4.value = 1 - deltas[2];
        this.points.pointsMaterial.uniforms.isColor3.value = deltas[2];
        this.points.pointsMaterial.uniforms.isColor4.value = 1 - deltas[2];
      }
      if (posPoint < posTexts[2]) {
        this.material.uniforms.isColor4.value = deltas[3];
        this.material.uniforms.isColor5.value = 1 - deltas[3];
        this.points.pointsMaterial.uniforms.isColor4.value = deltas[3];
        this.points.pointsMaterial.uniforms.isColor5.value = 1 - deltas[3];
      }
    });
  }
  anim(progress, time) {
    this.material.uniforms.time.value = time;
    this.materialBG.uniforms.time.value = time;

    this.textStars.anim(progress * 12, time);
    this.mesh.position.y = this.positionY.value;
  }
}
