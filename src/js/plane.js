import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

export default class Plane {
  constructor(options) {
    this.gltfLoader = new GLTFLoader();

    this.scene = options.scene;
  }

  init() {
    this.addPlane();
  }

  addPlane() {
    this.palmtreeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    this.gltfLoader.load("/models/plane.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        child.material = this.palmtreeMaterial;
      });

      gltf.scene.rotation.y = 1.6;
      gltf.scene.scale.set(2, 2, 2);
      gltf.scene.position.set(155, 55, -52);

      this.scene.add(gltf.scene);
    });
  }
}