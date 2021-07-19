import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Cinema {
  constructor(options) {
    this.scene = options.scene;

    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();

    this.cinema = new THREE.Group();
  }

  init() {
    this.addCinema();

    this.cinema.scale.set(2, 2, 2);

    this.cinema.rotation.y = 0.5;
    this.cinema.position.x = -100;
    this.cinema.position.y = 10;
    this.cinema.position.z = 250;
    this.scene.add(this.cinema);
  }

  addCinema() {
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
    });

    const bakedTexture = this.textureLoader.load("/img/baked2.jpg");
    bakedTexture.flipY = false;
    bakedTexture.encoding = THREE.sRGBEncoding;
    const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

    this.gltfLoader.load("/models/cinema.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.type === "Mesh") {
          child.material = bakedMaterial;
          console.log(child);
        }
      });

      this.cinema.add(gltf.scene);
    });
  }

  anim(progress, time) {}
}
