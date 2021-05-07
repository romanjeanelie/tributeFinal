import * as THREE from "three";

import Palmtrees from "./palmtrees";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Road {
  constructor(options) {
    this.gui = options.gui;
    this.gui.hide();

    this.scene = options.scene;

    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();

    this.street = new THREE.Group();
    this.palmtrees = new Palmtrees({ scene: this.street, gui: this.gui });
  }

  init() {
    this.addModelRoad();
    this.palmtrees.init();
    this.scene.add(this.street);
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

      this.gui.add(gltf.scene.rotation, "y", 4, 5, 0.0001).name("roadRotationX");

      this.gui.add(gltf.scene.position, "x", -5, 3, 0.0001).name("roadpositionX");
      this.gui.add(gltf.scene.position, "y", -5, 3, 0.0001).name("roadpositionX");
      this.gui.add(gltf.scene.position, "z", -5, 3, 0.0001).name("roadpositionX");

      this.street.add(gltf.scene);

      this.street.position.y = -50.5;
      this.street.position.z = 65;
    });
  }
}
