import * as THREE from "three";

import fragment from "./shaders/sky/fragment.glsl";
import vertex from "./shaders/sky/vertex.glsl";

export default class Sky {
  constructor(options) {
    this.scene = options.scene;
    this.gui = options.gui;
    this.debugObject = {};

    this.positionX = 2000;
    this.positionY = -410;
    this.positionZ = -3000;
  }

  init() {
    this.setColors();
    this.createClouds();
  }

  createClouds() {
    this.geometry = new THREE.PlaneGeometry(1, 1);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        progress: { value: 0 },
        color1: { value: new THREE.Color("#000000") },
        color2: { value: new THREE.Color("#051C70") },
        color3: { value: new THREE.Color("#553533") },
        color4: { value: new THREE.Color("#3B191D") },
        opacity: { value: 0 },
      },
      side: THREE.DoubleSide,
      vertexShader: vertex,
      fragmentShader: fragment,
      //transparent: true,
      // depthWrite: false,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.scale.set(24000, 7000, 100);

    this.mesh.position.x = this.positionX;
    this.mesh.position.y = this.positionY;
    this.mesh.position.z = this.positionZ;

    this.mesh.rotation.z = Math.PI;

    this.scene.add(this.mesh);
  }

  setColors() {
    this.debugObject.color1 = "#3B003D";
    this.gui
      .addColor(this.debugObject, "color1")
      .onChange(() => (this.material.uniforms.color1.value = new THREE.Color(this.debugObject.color1)))
      .name("skyColor");
  }

  anim(time, progress) {
    this.material.uniforms.time.value = time;
    this.material.uniforms.progress.value = progress;
  }
}
