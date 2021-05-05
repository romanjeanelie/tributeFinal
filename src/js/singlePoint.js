import * as THREE from "three";

import fragment from "./shaders/singlePoint/fragment.glsl";
import vertex from "./shaders/singlePoint/vertex.glsl";

export default class SinglePoint {
  constructor(options) {
    this.scene = options.scene;
    this.gui = options.gui;
    this.debugObject = {};
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
      depthWrite: false,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  setColors() {
    this.debugObject.color1 = "#ff0559";
    this.gui
      .addColor(this.debugObject, "color1")
      .onChange(() => (this.material.uniforms.color1.value = new THREE.Color(this.debugObject.color1)))
      .name("singlePointColor");
  }

  anim(tl) {
    tl.fromTo(
      this.material.uniforms.opacity,
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
