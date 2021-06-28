import * as THREE from "three";

import fragment from "./shaders/progressBar/fragment.glsl";
import vertex from "./shaders/progressBar/vertex.glsl";

export default class Circle {
  constructor(options) {
    this.scene = options.scene;
    this.gui = options.gui;
    this.debugObject = {};
  }

  init() {
    this.createBar();
  }

  createCircle() {
    this.geometry = new THREE.PlaneGeometry(1, 1);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        progress: { value: 0 },
        opacity: { value: 1 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.mesh);
  }

  anim(time, progress) {
    this.material.uniforms.time.value = time;
    this.material.uniforms.progress.value = progress;
  }
}
