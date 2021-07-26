import * as THREE from "three";
import { gsap } from "gsap";

import fragment from "./shaders/sky/fragment.glsl";
import vertex from "./shaders/sky/vertex.glsl";

export default class Sky {
  constructor(options) {
    this.scene = options.scene;
    this.gui = options.gui;
    this.debugObject = {};

    this.positionX = 0;
    this.positionY = 8000;
    this.positionZ = -7000;

    this.opacity = 0;
    this.animColors = { value: 1 };

    this.material = null;
  }

  init() {
    this.createSky();
  }

  createSky() {
    this.setColors();

    this.geometry = new THREE.PlaneGeometry(1, 2);
    // this.geometry = new THREE.PlaneGeometry(1, 1);

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(this.debugObject.color1) },
        color2: { value: new THREE.Color(this.debugObject.color2) },
        color3: { value: new THREE.Color(this.debugObject.color3) },
        opacity: { value: this.opacity },
        animColors: { value: this.animColors.value },
      },
      side: THREE.DoubleSide,
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
    });
    // this.material = new THREE.MeshBasicMaterial({
    //   color: 0xff0000,
    //   side: THREE.DoubleSide,
    // });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.scale.set(105000, 15000, 100);

    this.mesh.position.x = this.positionX;
    this.mesh.position.y = this.positionY;
    this.mesh.position.z = this.positionZ;

    this.mesh.rotation.z = Math.PI;

    this.scene.add(this.mesh);
  }

  setColors() {
    this.debugObject.color1 = "#4d2702";
    this.gui
      .addColor(this.debugObject, "color1")
      .onChange(() => (this.material.uniforms.color1.value = new THREE.Color(this.debugObject.color1)))
      .name("skyColor1");

    this.debugObject.color2 = "#450800";
    this.gui
      .addColor(this.debugObject, "color2")
      .onChange(() => (this.material.uniforms.color2.value = new THREE.Color(this.debugObject.color2)))
      .name("skyColor2");

    this.debugObject.color3 = "#21212f";
    this.gui
      .addColor(this.debugObject, "color3")
      .onChange(() => (this.material.uniforms.color3.value = new THREE.Color(this.debugObject.color3)))
      .name("skyColor3");
  }

  anim(time, progress, scrollSpeedEased) {
    this.material.uniforms.time.value = time;
    this.material.uniforms.opacity.value = this.opacity;
    this.material.uniforms.animColors.value = this.animColors.value;
  }
}
