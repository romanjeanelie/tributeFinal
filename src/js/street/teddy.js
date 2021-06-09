import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Teddy {
  constructor(options) {
    this.scene = options.scene;

    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();
  }

  init() {
    this.addTeddy();
  }

  addTeddy() {
    const matcapTexture = this.textureLoader.load("/textures/teddy/matcap1.png");
    console.log(matcapTexture);

    const material = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
      //depthWrite: false,
    });
    this.gltfLoader.load("/models/teddy.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.type === "Mesh") {
          child.material = material;
        }
      });

      gltf.scene.position.x = 300;
      gltf.scene.position.y = 150;
      gltf.scene.position.z = -180;

      gltf.scene.rotation.y = -Math.PI * 0.25;

      gltf.scene.scale.set(25, 25, 25);
      this.scene.add(gltf.scene);
    });
  }
}
