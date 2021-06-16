import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

export default class Landscape {
  constructor(options) {
    this.gltfLoader = new GLTFLoader();

    this.scene = options.scene;
  }

  init() {
    this.addLandscape();
  }

  addLandscape() {
    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    this.gltfLoader.load("/models/landscape.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        //  child.material = this.material;
      });

      gltf.scene.rotation.y = Math.PI * 0.5;
      gltf.scene.scale.set(200, 130, 120);
      gltf.scene.position.x = 300;
      gltf.scene.position.y = -10;
      gltf.scene.position.z = -600;

      this.scene.add(gltf.scene);
    });
  }
}
