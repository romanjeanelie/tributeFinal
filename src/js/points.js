import * as THREE from "three";

import fragment from "./shaders/points/fragment.glsl";
import vertex from "./shaders/points/vertex.glsl";

export default class Points {
  constructor(options) {
    this.scene = options.scene;
    this.gui = options.gui;
    this.debugObject = {};
  }

  init() {
    this.addPoints();
  }

  addPoints() {
    this.pointsGeometry = new THREE.BufferGeometry();
    this.count = 500;

    this.positions = new Float32Array(this.count * 3);

    for (let i = 0; i < this.count * 3; i++) {
      this.positions[i * 1] = (Math.random() - 0.5) * 10;
      this.positions[i * 2] = (Math.random() - 0.5) * 10;
      this.positions[i * 3] = (Math.random() - 0.5) * 10;
    }
    this.pointsGeometry.setAttribute("position", new THREE.BufferAttribute(this.positions, 3));
    this.pointsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        time: { value: 0 },
        color1: { value: new THREE.Color("#ff0559") },
        opacity: { value: 0 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
    });

    this.points = new THREE.Points(this.pointsGeometry, this.pointsMaterial);

    this.scene.add(this.points);
  }

  anim(tl) {
    tl.fromTo(
      this.pointsMaterial.uniforms.opacity,
      {
        value: 0,
      },
      {
        value: 1,
        duration: 6,
      },
      "<"
    );
  }
}
