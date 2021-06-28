import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import vertex from "../shaders/wheel/seats/vertex";
import fragment from "../shaders/wheel/seats/fragment";

export default class Wheel {
  constructor(options) {
    this.scene = options.scene;

    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();

    this.mainWheel = new THREE.Group();
    this.baseWheel = new THREE.Group();

    this.wheel = new THREE.Group();
  }

  init() {
    this.addMainWheel();
    this.addBaseWheel();

    this.mainWheel.position.y = 13;

    this.wheel.add(this.baseWheel);
    this.wheel.add(this.mainWheel);

    this.wheel.position.x = 100;
    this.wheel.position.y = 0;
    this.wheel.position.z = 10;

    this.wheel.rotation.y = -Math.PI * 0.3;

    this.wheel.scale.set(1, 1, 1);
    this.scene.add(this.wheel);
  }

  addMainWheel() {
    this.seatPositions = [];
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
      depthWrite: false,
      transparent: true,
      opacity: 0,
      //depthWrite: false,
    });
    this.gltfLoader.load("/models/mainWheel.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.name.includes("Seat")) {
          child.material = material;
          this.seatPositions.push(child.position);
        }
      });
      this.mainWheel.add(gltf.scene);

      gltf.scene.position.x = -0.17;
      gltf.scene.position.y = -14.6;

      this.createLightWheel(this.seatPositions);
    });
  }
  addBaseWheel() {
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
      depthWrite: false,
      transparent: true,
      opacity: 0,
      //depthWrite: false,
    });
    this.gltfLoader.load("/models/baseWheel.glb", (gltf) => {
      //gltf.scene.position.x = -0.17;
      //gltf.scene.position.y = -14.6;
      this.baseWheel.add(gltf.scene);
    });
  }

  createLightWheel(positionsWindow) {
    const count = positionsWindow.length;
    this.pointsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        opacity: { value: 1 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      //depthWrite: false,
    });

    const pointsGeometry = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const opacity = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 0] = positionsWindow[i].x - 0.17;
      positions[i3 + 1] = positionsWindow[i].y - 14.6;
      positions[i3 + 2] = positionsWindow[i].z;

      size[i] = 6000;
      opacity[i] = Math.random() * 0.6;
    }

    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute("size", new THREE.BufferAttribute(size, 1));
    pointsGeometry.setAttribute("opacity", new THREE.BufferAttribute(opacity, 1));

    const points = new THREE.Points(pointsGeometry, this.pointsMaterial);
    this.mainWheel.add(points);
  }

  anim(progress, time) {
    this.mainWheel.rotation.z = time * 0.05;
  }
}
