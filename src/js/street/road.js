import * as THREE from "three";
import * as dat from "dat.gui";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Road {
  constructor(options) {
    this.gui = options.gui;
    this.gui.hide();

    this.scene = options.scene;

    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();
  }

  init() {
    this.addModelRoad();
  }

  addModelRoad() {
    this.bakedTexture = this.textureLoader.load("/textures/street/baked03.jpg");
    this.bakedTexture.flipY = false;
    this.bakedMaterial = new THREE.MeshBasicMaterial({ map: this.bakedTexture });

    this.gltfLoader.load("/models/street-with-car.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        child.material = this.bakedMaterial;
      });
      gltf.scene.rotation.y = 4.7132;

      gltf.scene.position.y = -50.5;
      gltf.scene.position.z = 65;

      this.gui.add(gltf.scene.rotation, "y", 4, 5, 0.0001).name("roadRotationX");

      this.gui.add(gltf.scene.position, "x", -5, 3, 0.0001).name("roadpositionX");
      this.gui.add(gltf.scene.position, "y", -5, 3, 0.0001).name("roadpositionX");
      this.gui.add(gltf.scene.position, "z", -5, 3, 0.0001).name("roadpositionX");
      this.scene.add(gltf.scene);
    });
  }
}
