import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

export default class Clouds {
  constructor(options) {
    this.gltfLoader = new GLTFLoader();

    this.scene = options.scene;
  }

  init() {
    this.addClouds();
  }

  addClouds() {
    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    this.gltfLoader.load("/models/clouds.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        //child.material = this.material;
      });
      gltf.scene.rotation.y = Math.PI * 0.5;
      gltf.scene.scale.set(40, 40, 40);
      gltf.scene.position.x = -30;
      gltf.scene.position.y = 35;
      gltf.scene.position.z = -300;

      this.scene.add(gltf.scene);
    });
  }
}
