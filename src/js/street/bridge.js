import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import vertex from "../shaders/bridge/vertex";
import fragment from "../shaders/bridge/fragment";
import vertex2 from "../shaders/bridge/vertex2";
import fragment2 from "../shaders/bridge/fragment2";

export default class Bridge {
  constructor(options) {
    this.scene = options.scene;

    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();

    this.lightsRoad = new THREE.Group();
    this.bridge = new THREE.Group();
  }

  init() {
    this.addBridge();
    this.addRoad();

    this.bridge.position.x = 0;
    this.bridge.position.y = 10;
    this.bridge.position.z = 310;

    this.bridge.rotation.y = -Math.PI * 0.47;

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
        color1: { value: new THREE.Color("#Fff") },
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

  addRoad() {
    this.pointsMaterial1 = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        time: { value: 0 },
        move: { value: 0 },
        color1: { value: new THREE.Color("#E77F68") },
        color2: { value: new THREE.Color("#ffffff") },
        opacity: { value: 1 },
      },
      vertexShader: vertex2,
      fragmentShader: fragment2,
      transparent: true,
      depthWrite: false,
    });

    const minPosX = 12;
    const maxPosX = 5;
    const minPosY = 16;
    const maxPosY = 0;
    const minPosZ = -150;
    const maxPosZ = 300;
    const sizePoint = 9000;
    const pointsMaterial = this.pointsMaterial1;
    const nbPoints = 200;

    const pointsGeometry = new THREE.BufferGeometry();
    const count = nbPoints;

    const positions = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const opacity = new Float32Array(count);

    for (let i = 0; i < count * 3; i++) {
      const i3 = i * 3;
      positions[i3 + 0] = minPosX + (Math.random() - 0.5) * maxPosX;
      positions[i3 + 1] = minPosY + (Math.random() - 0.5) * maxPosY;
      positions[i3 + 2] = minPosZ + Math.random() * maxPosZ;

      size[i] = 500 + Math.random() * sizePoint;
      opacity[i] = Math.random();
    }
    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute("size", new THREE.BufferAttribute(size, 1));
    pointsGeometry.setAttribute("opacity", new THREE.BufferAttribute(opacity, 1));

    const points = new THREE.Points(pointsGeometry, pointsMaterial);

    this.lightsRoad.add(points);
    this.bridge.add(this.lightsRoad);
  }

  anim(progress, time) {}
}
