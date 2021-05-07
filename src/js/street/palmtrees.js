import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

export default class Palmtrees {
  constructor(options) {
    this.gltfLoader = new GLTFLoader();

    this.scene = options.scene;
  }

  init() {
    this.addPalmtrees();
  }

  addPalmtrees() {
    this.palmtreeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    this.gltfLoader.load("/models/palmtree.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        child.material = this.palmtreeMaterial;
      });

      gltf.scene.rotation.y = 1.6;
      gltf.scene.scale.set(20, 20, 20);
      gltf.scene.position.set(-5, -4, -12);

      const copyPalmtree = gltf.scene.clone();
      copyPalmtree.position.set(-16, -4.5, -6);
      this.scene.add(gltf.scene, copyPalmtree);
    });
  }
}
