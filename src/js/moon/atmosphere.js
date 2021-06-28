import * as THREE from "three";

import fragment from "../shaders/atmosphereMoon/fragment.glsl";
import vertex from "../shaders/atmosphereMoon/vertex.glsl";

export default class Atmosphere {
  constructor(options) {
    this.gui = options.gui;
    this.debugObject = {};
    // this.folderMoon = this.gui.addFolder("Moon");

    this.scene = options.scene;
  }

  init() {
    this.addAtmosphere();
  }

  addAtmosphere() {
    this.geometry = new THREE.PlaneBufferGeometry(1, 1);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Color("#F81C39") },
        color2: { value: new THREE.Color("#EE31C3") },
      },
      transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.scale.set(200, 200, 200);
    this.mesh.position.z = -4;

    this.scene.add(this.mesh);
  }
}
