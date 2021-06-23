import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

import fragment from "../shaders/adBoard/fragment.glsl";
import vertex from "../shaders/adBoard/vertex.glsl";

import lipstick from "../texture/lipstick.png";

export default class AdBoard {
  constructor(options) {
    this.gltfLoader = new GLTFLoader();

    this.scene = options.scene;
  }

  init() {
    this.addBoard();
  }

  addBoard() {
    const img = new Image();
    img.src = lipstick;
    const texture = new THREE.Texture(img);
    texture.needsUpdate = true;

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        progress: { value: 0 },
        opacity: { value: 1 },
        uTexture: { value: texture },
      },
      side: THREE.DoubleSide,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.material.uniforms.uTexture.value = texture;

    this.gltfLoader.load("/models/advertising-board.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.name === "big-panneau") {
          child.material = this.material;
        }
      });

      gltf.scene.scale.set(0.4, 0.4, 0.4);
      gltf.scene.rotation.y = 1;

      gltf.scene.position.x = 100;
      gltf.scene.position.y = 15;
      gltf.scene.position.z = 100;

      this.scene.add(gltf.scene);
    });
  }

  anim(progress, time) {
    this.material.uniforms.time.value = time;
  }
}
