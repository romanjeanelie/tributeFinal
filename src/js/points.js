import * as THREE from "three";

import fragment from "./shaders/points/fragment.glsl";
import vertex from "./shaders/points/vertex.glsl";

export default class Points {
  constructor(options) {
    this.scene = options.scene;
    this.gui = options.gui;
    this.debugObject = {};

    this.pointsGroup = new THREE.Group();
  }

  init() {
    this.createPointsMaterials();
    this.addPoints(0, -70, this.pointsMaterial1, 20);
    this.addPoints(0, 10, this.pointsMaterial2, 60);
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

  addPoints(minPosZ, maxPosZ, pointsMaterial, nbPoints) {
    const pointsGeometry = new THREE.BufferGeometry();
    const count = nbPoints;

    const positions = new Float32Array(count * 3);
    const size = new Float32Array(count);

    for (let i = 0; i < count * 3; i++) {
      const i3 = i * 3;
      positions[i3 + 0] = (Math.random() - 0.5) * 50;
      positions[i3 + 1] = (Math.random() - 0.5) * 50;
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
