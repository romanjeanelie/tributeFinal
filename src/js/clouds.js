import * as THREE from "three";

import fragment from "./shaders/clouds/fragment.glsl";
import vertex from "./shaders/clouds/vertex.glsl";

export default class Clouds {
  constructor(options) {
    this.scene = options.scene;
    this.gui = options.gui;
    this.debugObject = {};

    this.positionX = 0;
    this.positionY = -305;
    this.positionZ = -800;
  }

  init() {
    this.setColors();
    this.createClouds();
  }

  createClouds() {
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
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

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.scale.set(6000, 200, 1500);
    // this.mesh.scale.set(100, 100, 100);

    this.mesh.position.x = this.positionX;
    this.mesh.position.y = this.positionY;
    this.mesh.position.z = this.positionZ;

    this.scene.add(this.mesh);
  }

  setColors() {
    this.debugObject.color1 = "#ff0000";
    this.gui
      .addColor(this.debugObject, "color1")
      .onChange(() => (this.material.uniforms.color1.value = new THREE.Color(this.debugObject.color1)))
      .name("cloudsColor");
  }

  anim(time, progress) {
    this.material.uniforms.time.value = time;
    this.material.uniforms.progress.value = progress;
  }
}
