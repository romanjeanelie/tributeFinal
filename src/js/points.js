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

    this.color1 = null;
    this.color2 = null;
    this.color3 = null;
    this.color4 = null;
    this.color5 = null;
  }

  init() {
    this.createPointsMaterials();
    this.addPoints({
      minX: 0,
      maxX: 13300,
      minY: -700,
      maxY: 9000,
      minZ: -500,
      maxZ: 550,
      material: this.pointsMaterial,
      qty: 1900,
      size: 20000,
    });
  }

  createPointsMaterials() {
    this.pointsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        time: { value: 0 },
        color1: { value: this.color1 },
        color2: { value: this.color2 },
        color3: { value: this.color3 },
        color4: { value: this.color4 },
        color5: { value: this.color5 },
        isColor1: { value: 1 },
        isColor2: { value: 0 },
        isColor3: { value: 0 },
        isColor4: { value: 0 },
        isColor5: { value: 0 },
        opacity: { value: 0 },
        squeeze: { value: 0 },
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

      size[i] = 500 + Math.random() * options.size;
    }
    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute("size", new THREE.BufferAttribute(size, 1));

    const points = new THREE.Points(pointsGeometry, pointsMaterial);

    this.pointsGroup.add(points);
    this.scene.add(this.pointsGroup);
  }

  anim(progress, time) {
    this.pointsMaterial.uniforms.time.value = time;
  }
}
