import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Teddy {
  constructor(options) {
    this.scene = options.scene;

    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();

    this.teddyMesh = new THREE.Group();
  }

  init() {
    this.addTeddy();
    this.scene.add(this.teddyMesh);
  }

  addTeddy() {
    const matcapTexture = this.textureLoader.load("/textures/teddy/matcap1.png");

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

      gltf.scene.position.x = 150;
      gltf.scene.position.y = 40;
      gltf.scene.position.z = 0;

      gltf.scene.rotation.y = -Math.PI * 0.25;

      gltf.scene.scale.set(4, 4, 4);
      this.teddyMesh.add(gltf.scene);
    });
  }

  anim(progress, time) {
    // this.teddyMesh.position.x -= time * 0.1;
    // this.teddyMesh.position.z += time * 0.05;
  }
}
