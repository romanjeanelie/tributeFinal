import gsap from "gsap/gsap-core";
import * as THREE from "three";

import fragment from "./shaders/singlePoint/fragment.glsl";
import vertex from "./shaders/singlePoint/vertex.glsl";
import fragmentBG from "./shaders/singlePoint/fragmentBG.glsl";
import vertexBG from "./shaders/singlePoint/vertexBG.glsl";

export default class SinglePoint {
  constructor(options) {
    this.gui = options.gui;
    this.debugObject = {};

    this.activeWave = { value: 0 };

    this.scene = options.scene;

    this.positionX = 0;
    this.positionY = 0;
    this.positionZ = -130;
  }

  init() {
    this.setColors();
    this.createPoint();
    this.createBackground();
  }

  createPoint() {
    this.geometry = new THREE.PlaneGeometry(0.2, 0.2, 1, 1);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(this.debugObject.color1) },
        opacity: { value: 0 },
        isPressed: { value: 2.5 },
      },
      side: THREE.DoubleSide,
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.position.x = this.positionX;
    this.mesh.position.y = this.positionY;
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
    this.background.position.y = this.positionY;
    this.background.position.z = this.positionZ - 10;

    this.background.scale.set(500, 500, 1);

    this.scene.add(this.background);
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

  move(time) {
    const speed = 25;
    // this.mesh.position.x = Math.sin(time * 2 * speed) * 0.5 * this.activeWave.value;
    // this.mesh.position.y = Math.cos(time * 8 * speed) * 0.1 * this.activeWave.value;
  }
  anim(progress, time) {
    this.material.uniforms.time.value = time;
    this.materialBG.uniforms.time.value = time;
  }
}
