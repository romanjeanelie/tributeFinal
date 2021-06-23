import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

import TextLandscape from "./textLandscape";

export default class Landscape {
  constructor(options) {
    this.gltfLoader = new GLTFLoader();

    this.scene = options.scene;

    // this.textLandscape = new TextLandscape({ scene: this.scene });
  }

  init() {
    this.addLandscape({ x: 300, y: -35, z: -600 });
    this.addLandscape2({ x: -250, y: 1, z: 100 });
    this.addLandscape3({ x: -950, y: -10, z: 800 });
  }

  addLandscape(options) {
    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    this.gltfLoader.load("/models/landscape.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        //  child.material = this.material;
      });

      gltf.scene.rotation.y = Math.PI * 0.5;
      gltf.scene.scale.set(200, 130, 120);
      gltf.scene.position.x = options.x;
      gltf.scene.position.y = options.y;
      gltf.scene.position.z = options.z;

      // this.textLandscape.addtext1(options);
      this.scene.add(gltf.scene);
    });
  }
  addLandscape2(options) {
    const material = new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.6, transparent: true });

    this.gltfLoader.load("/models/landscape2.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        // child.material = material;
      });

      gltf.scene.rotation.y = Math.PI * 0.5;
      gltf.scene.scale.set(200, 130, 120);
      gltf.scene.position.x = options.x;
      gltf.scene.position.y = options.y;
      gltf.scene.position.z = options.z;

      this.scene.add(gltf.scene);
    });
  }
  addLandscape3(options) {
    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    this.gltfLoader.load("/models/landscape3.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        //  child.material = this.material;
      });

      gltf.scene.rotation.y = Math.PI * 0.5;
      gltf.scene.scale.set(200, 130, 120);
      gltf.scene.position.x = options.x;
      gltf.scene.position.y = options.y;
      gltf.scene.position.z = options.z;

      this.scene.add(gltf.scene);
    });
  }
}
