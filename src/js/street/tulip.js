import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import vertex from "../shaders/wheel/seats/vertex";
import fragment from "../shaders/wheel/seats/fragment";

export default class Tulip {
  constructor(options) {
    this.scene = options.scene;

    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();

    this.tulip = new THREE.Group();
  }

  init() {
    this.addTulip();

    // this.tulip.position.x = 100;
    this.tulip.position.x = 0;
    this.tulip.position.y = 2;
    this.tulip.position.z = 350;

    this.tulip.rotation.x = -Math.PI * 0.5;
    this.tulip.rotation.y = -Math.PI;
    this.tulip.rotation.z = -0.7;

    this.tulip.scale.set(6, 6, 6);
    this.scene.add(this.tulip);
  }

  addTulip() {
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
    });

    const bakedTexture = this.textureLoader.load("/img/baked.jpg");
    bakedTexture.flipY = false;
    bakedTexture.encoding = THREE.sRGBEncoding;
    const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

    this.gltfLoader.load("/models/tulip.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.type === "Mesh") {
          child.material = bakedMaterial;
        }
      });
      // this.tulip.add(gltf.scene);
    });
  }

  anim(progress, time) {}
}
