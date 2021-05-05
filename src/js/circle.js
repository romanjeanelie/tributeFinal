import * as THREE from "three";

import fragment from "./shaders/circle/fragment.glsl";
import vertex from "./shaders/circle/vertex.glsl";

export default class Circle {
  constructor(options) {
    this.scene = options.scene;
    this.gui = options.gui;
    this.debugObject = {};

    this.circlePositionZ = 0.05;
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
        color1: { value: new THREE.Color(this.debugObject.color1) },
      },
      side: THREE.DoubleSide,
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
    });

    this.circle = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.circle);
  }

  setColors() {
    this.debugObject.color1 = "#0705FF";
    this.gui
      .addColor(this.debugObject, "color1")
      .onChange(() => (this.material.uniforms.color1.value = new THREE.Color(this.debugObject.color1)))
      .name("circleColor");
  }

  anim(tl) {
    tl.fromTo(
      this.circle.position,
      {
        y: -2,
      },
      {
        y: 0,
        duration: 5,
      }
    );
    tl.fromTo(
      this.circle.position,
      {
        z: this.circlePositionZ,
      },
      {
        z: 2,
        duration: 10,
        delay: 2,
      }
    );
  }
}
