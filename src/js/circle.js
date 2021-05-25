import * as THREE from "three";

import fragment from "./shaders/circle/fragment.glsl";
import vertex from "./shaders/circle/vertex.glsl";

export default class Circle {
  constructor(options) {
    this.scene = options.scene;
    this.gui = options.gui;
    this.debugObject = {};

    this.positionX = 0;
    this.positionY = -105;
    this.positionZ = -60;
  }

  init() {
    this.setColors();
    this.createCircle();
  }

  createCircle() {
    this.geometry = new THREE.PlaneGeometry(2, 2, 10, 10);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        progress: { value: 0 },
        color1: { value: new THREE.Color(this.debugObject.color1) },
        opacity: { value: 1 },
      },
      side: THREE.DoubleSide,
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
    });

    this.circleMesh = new THREE.Mesh(this.geometry, this.material);

    this.circleMesh.scale.set(100, 100, 100);

    this.circleMesh.position.x = this.positionX;
    this.circleMesh.position.y = this.positionY;
    this.circleMesh.position.z = this.positionZ;

    this.scene.add(this.circleMesh);
  }

  setColors() {
    this.debugObject.color1 = "#0705FF";
    this.gui
      .addColor(this.debugObject, "color1")
      .onChange(() => (this.material.uniforms.color1.value = new THREE.Color(this.debugObject.color1)))
      .name("circleColor");
  }

  anim(time, progress) {
    this.material.uniforms.time.value = time;
    this.material.uniforms.progress.value = progress;
  }
}
