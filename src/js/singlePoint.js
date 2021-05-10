import gsap from "gsap/gsap-core";
import * as THREE from "three";

import fragment from "./shaders/singlePoint/fragment.glsl";
import vertex from "./shaders/singlePoint/vertex.glsl";

export default class SinglePoint {
  constructor(options) {
    this.gui = options.gui;
    this.debugObject = {};

    this.activeWave = { value: 0 };

    this.scene = options.scene;
  }

  init() {
    this.setColors();
    this.createPoint();
  }

  createPoint() {
    this.geometry = new THREE.PlaneGeometry(2, 2, 10, 10);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(this.debugObject.color1) },
        opacity: { value: 0 },
      },
      side: THREE.DoubleSide,
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      //alphaTest: 0.001,
      depthWrite: false,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.geometry.center();
    this.scene.add(this.mesh);
  }

  setColors() {
    this.debugObject.color1 = "#ff0559";
    this.gui
      .addColor(this.debugObject, "color1")
      .onChange(() => (this.material.uniforms.color1.value = new THREE.Color(this.debugObject.color1)))
      .name("singlePointColor");
  }

  move(time) {
    const speed = 25;
    this.mesh.position.x = Math.sin(time * 2 * speed) * 0.5 * this.activeWave.value;
    this.mesh.position.y = Math.cos(time * 8 * speed) * 0.1 * this.activeWave.value;
  }
}
