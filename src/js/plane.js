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
    this.material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    this.gltfLoader.load("/models/plane.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        child.material = this.material;
      });

      gltf.scene.rotation.y = 1.6;
      gltf.scene.scale.set(10, 10, 10);
      gltf.scene.position.set(0, -6600, 3200);
      this.scene.add(gltf.scene);
      console.log("plane");
    });
  }
}
