import * as THREE from "three";
import { gsap } from "gsap";

export default class BackSky {
  constructor(options) {
    this.scene = options.scene;
    this.gui = options.gui;
    this.debugObject = {};

    this.positionX = 0;
    this.positionY = -3800;
    this.positionZ = -1500;

    this.material = null;

    this.video = document.getElementById("video");
  }

  init() {
    this.createBackSky();
  }

  createBackSky() {
    this.geometry = new THREE.PlaneGeometry(1, 1);
    this.material = new THREE.MeshBasicMaterial({
      opacity: 0.7,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const videoTexture = new THREE.VideoTexture(this.video);
    this.material.map = videoTexture;
    // this.video.play();

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.scale.set(15000, 6000, 100);

    this.mesh.position.x = this.positionX;
    this.mesh.position.y = this.positionY;
    this.mesh.position.z = this.positionZ;

    // this.mesh.rotation.y = Math.PI;

    this.scene.add(this.mesh);
  }

  anim(time, progress, scrollSpeedEased) {
    this.material.uniforms.time.value = time;
    this.material.uniforms.progress.value = progress;
    this.material.uniforms.thickFactor.value = scrollSpeedEased.value;
  }
}
