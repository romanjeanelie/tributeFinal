import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class CinemaScreen {
  constructor(options) {
    this.scene = options.scene;

    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();
  }

  init() {
    this.screen = new THREE.Group();

    this.addScreen();

    this.screen.scale.set(1, 1, 1);

    this.screen.rotation.y = Math.PI * 0.5;

    this.screen.position.x = 10;
    this.screen.position.y = 55;
    this.screen.position.z = 329;

    // this.scene.add(this.screen);
  }

  addScreen(options) {
    const material = new THREE.MeshBasicMaterial({
      color: 0x110111,
      side: THREE.DoubleSide,
    });

    this.gltfLoader.load("/models/cinemaScreen.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.type === "Mesh") {
          child.material = material;
        }
      });
      this.screen.add(gltf.scene);
    });
  }

  anim(progress, time) {}
}
