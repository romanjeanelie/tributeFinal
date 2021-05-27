import * as THREE from "three";

import fragment from "./shaders/points/fragment.glsl";
import vertex from "./shaders/points/vertex.glsl";

export default class Points {
  constructor(options) {
    this.scene = options.scene;
    this.gui = options.gui;
    this.debugObject = {};

    this.opacity = 0;

    this.pointsGroup = new THREE.Group();
  }

  init() {
    this.createPointsMaterials();
    this.addPoints({
      minX: 0,
      maxX: 800,
      minY: -10,
      maxY: 600,
      minZ: -300,
      maxZ: -100,
      material: this.pointsMaterial1,
      qty: 100,
    });
    this.addPoints({
      minX: 0,
      maxX: 4000,
      minY: -150,
      maxY: 100,
      minZ: -100,
      maxZ: -2000,
      material: this.pointsMaterial2,
      qty: 4000,
    });
    this.addPoints({
      minX: 0,
      maxX: 800,
      minY: -700,
      maxY: 1000,
      minZ: -100,
      maxZ: -500,
      material: this.pointsMaterial3,
      qty: 100,
    });
    this.addPoints(10, 80, this.pointsMaterial3, 150);
  }

  createPointsMaterials() {
    this.pointsMaterial1 = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        time: { value: 0 },
        color1: { value: new THREE.Color("#ff0559") },
        opacity: { value: 0 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
    });
    this.pointsMaterial2 = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        time: { value: 0 },
        color1: { value: new THREE.Color("#ff0559") },
        opacity: { value: 0 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
    });
    this.pointsMaterial3 = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        time: { value: 0 },
        color1: { value: new THREE.Color("#ff0559") },
        opacity: { value: 0 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
    });
  }

  addPoints(options) {
    const minPosX = options.minX;
    const maxPosX = options.maxX;
    const minPosY = options.minY;
    const maxPosY = options.maxY;
    const minPosZ = options.minZ;
    const maxPosZ = options.maxZ;
    const pointsMaterial = options.material;
    const nbPoints = options.qty;
    const pointsGeometry = new THREE.BufferGeometry();
    const count = nbPoints;

    const positions = new Float32Array(count * 3);
    const size = new Float32Array(count);

    for (let i = 0; i < count * 3; i++) {
      const i3 = i * 3;
      positions[i3 + 0] = minPosX + (Math.random() - 0.5) * maxPosX;
      positions[i3 + 1] = minPosY + (Math.random() - 0.5) * maxPosY;
      positions[i3 + 2] = minPosZ + Math.random() * maxPosZ;

      size[i] = 500 + Math.random() * 9000;
    }
    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute("size", new THREE.BufferAttribute(size, 1));

    const points = new THREE.Points(pointsGeometry, pointsMaterial);

    this.pointsGroup.add(points);
    this.scene.add(this.pointsGroup);
  }
}
