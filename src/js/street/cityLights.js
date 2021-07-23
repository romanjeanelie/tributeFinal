import * as THREE from "three";

import fragment from "../shaders/streetLight/fragment.glsl";
import vertex from "../shaders/streetLight/vertex.glsl";

import TextLight from "../textLight.js";

export default class CityLights {
  constructor(options) {
    this.scene = options.scene;

    this.pointsGroup = new THREE.Group();

    this.loadingManager = options.loadingManager;

    this.textLight = new TextLight({
      scene: this.scene,
      loadingManager: this.loadingManager,
    });
  }

  init() {
    this.createPointsMaterials();

    this.nbRoad = 7;
    const offsetZ = 35;

    for (let i = 0; i < this.nbRoad; i++) {
      this.addLightsRoad({
        minX: 0,
        maxX: 200,
        minY: 0,
        maxY: 0,
        minZ: 0 + offsetZ * i,
        maxZ: 0,
        size: 9000,
        material: this.pointsMaterial1,
        qty: 100,
      });
      this.addLightsRoad({
        minX: 0,
        maxX: 200,
        minY: 1,
        maxY: 0,
        minZ: 0 + offsetZ * i,
        maxZ: 0,
        size: 12000,
        material: this.pointsMaterialBig,
        qty: 60,
      });
      this.addLightsRoad({
        minX: 0,
        maxX: Math.random() * 400,
        minY: 1,
        maxY: 0,
        minZ: 50,
        maxZ: Math.random() * 200,
        size: 24000,
        material: this.pointsMaterialBig,
        qty: 50,
      });
    }

    this.textLight.init();
  }

  createPointsMaterials() {
    this.pointsMaterial1 = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        time: { value: 0 },
        move: { value: 0 },
        color1: { value: new THREE.Color("#E77F68") },
        color2: { value: new THREE.Color("#ffffff") },
        opacity: { value: 1 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
    });
    this.pointsMaterialBig = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        time: { value: 0 },
        move: { value: 0 },
        color1: { value: new THREE.Color("#CAB9FE") },
        color2: { value: new THREE.Color("#ffffff") },
        opacity: { value: 1 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
    });
  }

  addLightsRoad(options) {
    const minPosX = options.minX;
    const maxPosX = options.maxX;
    const minPosY = options.minY;
    const maxPosY = options.maxY;
    const minPosZ = options.minZ;
    const maxPosZ = options.maxZ;
    const sizePoint = options.size;
    const pointsMaterial = options.material;
    const nbPoints = options.qty;
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

    this.pointsGroup.add(points);
    this.scene.add(this.pointsGroup);
  }

  anim(progress, time) {
    this.pointsMaterialBig.uniforms.time.value = time;
    this.pointsMaterial1.uniforms.time.value = time;
    this.textLight.anim(progress, time);
  }
}
