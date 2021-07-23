import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import vertex from "../shaders/stadium/vertex";
import fragment from "../shaders/stadium/fragment";

export default class Stadium {
  constructor(options) {
    this.scene = options.scene;

    this.loadingManager = options.loadingManager;
    this.gltfLoader = new GLTFLoader(this.loadingManager);
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);

    this.stadium = new THREE.Group();
  }

  init() {
    this.addStadium();

    this.stadium.scale.set(0.4, 0.4, 0.4);

    this.stadium.rotation.y = 0.3;

    this.stadium.position.x = -80;
    this.stadium.position.z = 190;

    this.scene.add(this.stadium);
  }

  addStadium() {
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
      opacity: 1,
    });

    const textMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#FF9000"),
      side: THREE.DoubleSide,
      opacity: 1,
    });

    const materialLight = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        color1: { value: new THREE.Color("#FFFEFF") },
        color2: { value: new THREE.Color("#ffffff") },
        opacity: { value: 1 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
    });
    this.gltfLoader.load("/models/stadium.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.type === "Mesh") {
          if (child.name.includes("Text")) {
            child.material = textMaterial;
          } else if (child.name.includes("Light")) {
            child.material = materialLight;
          } else {
            child.material = material;
          }
        }
      });
      this.stadium.add(gltf.scene);
    });
  }

  anim(progress, time) {}
}
