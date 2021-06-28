import * as THREE from "three";

import fragment from "../shaders/streetLight/fragment.glsl";
import vertex from "../shaders/streetLight/vertex.glsl";

export default class CityLights {
  constructor(options) {
    this.scene = options.scene;

    this.pointsGroup = new THREE.Group();
  }

  init() {
    this.createPointsMaterials();
    this.addPoints({
      minX: 0,
      maxX: 400,
      minY: 0,
      maxY: 0,
      minZ: -300,
      maxZ: 400,
      material: this.pointsMaterial1,
      qty: 500,
    });

    const nbLightRoad = 100;

    this.addLightsRoad({
      minX: 0,
      maxX: 200,
      minY: 0,
      maxY: 0,
      minZ: 40,
      maxZ: 0,
      material: this.pointsMaterial1,
      qty: nbLightRoad,
    });
    this.addLightsRoad({
      minX: 0,
      maxX: 200,
      minY: 0,
      maxY: 0,
      minZ: 20,
      maxZ: 0,
      material: this.pointsMaterial1,
      qty: nbLightRoad,
    });
    this.addLightsRoad({
      minX: 0,
      maxX: 200,
      minY: 0,
      maxY: 0,
      minZ: 50,
      maxZ: 0,
      material: this.pointsMaterial1,
      qty: nbLightRoad,
    });
    this.addLightsRoad({
      minX: 0,
      maxX: 200,
      minY: 0,
      maxY: 0,
      minZ: -10,
      maxZ: 0,
      material: this.pointsMaterial1,
      qty: nbLightRoad,
    });
  }

  createPointsMaterials() {
    this.pointsMaterial1 = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        time: { value: 0 },
        color1: { value: new THREE.Color("#ffffff") },
        opacity: { value: 1 },
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

  addLightsRoad(options) {
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
