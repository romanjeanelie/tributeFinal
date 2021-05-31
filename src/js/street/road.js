import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import vertex from "../shaders/buildings/vertex";
import fragment from "../shaders/buildings/fragment";

export default class Road {
  constructor(options) {
    this.debugObject = {};
    this.gui = options.gui;
    this.folderStreet = this.gui.addFolder("Street");

    this.scene = options.scene;

    this.gltfLoader = new GLTFLoader();

    this.street = new THREE.Group();
  }

  init() {
    this.addModelRoad();

    this.street.position.y = -3300;
    this.street.position.z = 900;

    this.street.scale.set(10, 10, 10);

    this.scene.add(this.street);
  }

  addModelRoad() {
    this.material = new THREE.MeshBasicMaterial({
      color: 0x3300000,
    });
    this.windowMaterial = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
    });

    this.gltfLoader.load("/models/street-with-car.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.name.includes("Window")) {
          child.material = this.windowMaterial;
        } else {
          child.material = this.material;
          console.log(child);
        }
      });
      gltf.scene.rotation.y = 4.7132;

      this.street.add(gltf.scene);
    });
  }

  addBuildingsandLamps() {
    this.gltfLoader.load("/models/buildings-with-lamps.glb", (gltf) => {
      gltf.scene.rotation.y = 4.7132;

      this.street.add(gltf.scene);
    });
  }
}
