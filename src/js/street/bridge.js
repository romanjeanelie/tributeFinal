import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import vertex from "../shaders/wheel/seats/vertex";
import fragment from "../shaders/wheel/seats/fragment";

export default class Bridge {
  constructor(options) {
    this.scene = options.scene;

    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();

    this.bridge = new THREE.Group();
  }

  init() {
    this.addTulip();

    // this.bridge.position.x = 100;
    this.bridge.position.x = -80;
    this.bridge.position.y = 0;
    this.bridge.position.z = 180;

    // this.bridge.rotation.x = -Math.PI * 0.5;
    this.bridge.rotation.y = 0.5;
    // this.bridge.rotation.z = -0.7;

    this.bridge.scale.set(0.1, 0.2, 0.1);
    this.scene.add(this.bridge);
  }

  addTulip() {
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
      opacity: 0.5,
    });

    this.gltfLoader.load("/models/bridge1.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.type === "Mesh") {
          child.material = material;
        }
      });
      // this.bridge.add(gltf.scene);
    });
  }

  anim(progress, time) {}
}
