import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import vertex from "../shaders/buildings/text/vertex";
import fragment from "../shaders/buildings/text/fragment";

export default class TextDance {
  constructor(options) {
    this.gui = options.gui;
    this.scene = options.scene;

    this.loader = new THREE.FontLoader();
    this.textureLoader = new THREE.TextureLoader();
    this.gltfLoader = new GLTFLoader();

    this.init(options);
    // this.addStructure(options);
  }

  init(options) {
    this.loader.load(`/fonts/${options.font}.json`, (font) => {
      this.createText(font, options);
    });
  }

  createText(font, options) {
    this.textGeometry = new THREE.TextGeometry(options.text, {
      font: font,
      size: 0.5,
      height: 0.05,
      curveSegments: 10,
      bevelEnabled: false,
      bevelThickness: 0.04,
      bevelSize: 0.0001,
      bevelOffset: 0.006,
      bevelSegments: 0.5,
    });

    this.textMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        activeLines: { value: 0 },
        progress: { value: 0 },
        opacity: { value: 1 },
        uColor1: { value: new THREE.Color(options.color1) },
        uColor2: { value: new THREE.Color(options.color2) },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      //   transparent: true,
    });

    this.textMesh = new THREE.Mesh(this.textGeometry, this.textMaterial);

    this.textGeometry.center();

    this.textMesh.position.x = options.posX;
    this.textMesh.position.y = options.posY;
    this.textMesh.position.z = options.posZ;

    if (options.rotateZ) {
      this.textMesh.rotation.z = options.rotateZ;
    }
    if (options.rotateY) {
      this.textMesh.rotation.y = options.rotateY;
    }
    this.textMesh.scale.set(options.scale, options.scale, options.scale);

    this.scene.add(this.textMesh);
  }

  addStructure(options) {
    // ADD triangle
    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 1, transparent: true });

    this.gltfLoader.load("/models/triangle.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        child.material = this.material;
      });

      gltf.scene.rotation.y = -Math.PI * 0.5;
      gltf.scene.position.x = options.posX;
      gltf.scene.position.y = options.posY - 2;
      gltf.scene.position.z = options.posZ - 0.5;

      gltf.scene.scale.set(1.5, 1.5, 1.5);
      this.scene.add(gltf.scene);
    });
  }

  anim(progress, time) {
    this.materialsText.forEach((material) => {
      material.uniforms.time.value = time;
      material.uniforms.progress.value = progress;

      material.uniforms.activeLines.value = progress;
    });
  }
}
