import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import vertex from "../shaders/bridge/vertex";
import fragment from "../shaders/bridge/fragment";

export default class Bridge {
  constructor(options) {
    this.scene = options.scene;

    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();

    this.bridge = new THREE.Group();
  }

  init() {
    this.addBridge();

    // this.bridge.position.x = 100;
    this.bridge.position.x = 0;
    this.bridge.position.y = 10;
    this.bridge.position.z = 310;

    this.bridge.rotation.y = -Math.PI * 0.5;
    // this.bridge.rotation.y = 0.5;
    // this.bridge.rotation.z = -0.7;

    this.bridge.scale.set(0.7, 0.7, 0.7);
    this.scene.add(this.bridge);
  }

  addBridge() {
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
      transparent: true,
      depthWrite: false,
    });
    this.gltfLoader.load("/models/bridge1.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.type === "Mesh") {
          if (child.name.includes("Text")) {
            child.material = textMaterial;
          } else if (child.name.includes("lightRope")) {
            child.material = materialLight;
          } else {
            child.material = material;
          }
        }
      });
      this.bridge.add(gltf.scene);
    });
  }

  anim(progress, time) {}
}
