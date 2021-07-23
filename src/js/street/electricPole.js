import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class ElectricPole {
  constructor(options) {
    this.scene = options.scene;

    this.loadingManager = options.loadingManager;
    this.gltfLoader = new GLTFLoader(this.loadingManager);
  }

  init() {
    this.poles = [
      {
        x: -80,
        y: 35,
        z: -50,
      },
      {
        x: -190,
        y: 41,
        z: -50,
      },
      //   {
      //     x: -280,
      //     y: 70,
      //     z: -50,
      //   },
    ];

    this.poles.forEach((el) => {
      this.addPole(el);
    });
  }

  addPole(options) {
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
    });

    const pole = new THREE.Group();

    this.gltfLoader.load("/models/electricPole.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.type === "Mesh") {
          child.material = material;
        }
      });

      pole.add(gltf.scene);
      pole.scale.set(0.12, 0.12, 0.12);
      pole.position.set(options.x, options.y, options.z);

      this.scene.add(pole);
    });
  }

  anim(progress, time) {}
}
