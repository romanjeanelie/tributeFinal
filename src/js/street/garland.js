import * as THREE from "three";

import fragment from "../shaders/garland/fragment.glsl";
import vertex from "../shaders/garland/vertex.glsl";

export default class Garland {
  constructor(options) {
    this.scene = options.scene;

    this.lightsGarland = new THREE.Group();
    this.garlands = new THREE.Group();
  }

  init() {
    const nbGarlands = 5;

    for (let i = 0; i < nbGarlands; i++) {
      this.createGarland(i);
    }

    this.garlands.rotation.y = -1;
    this.garlands.position.x = 120;
    this.garlands.position.y = 7;
    this.garlands.position.z = -23;

    this.scene.add(this.garlands);
  }

  createGarland(i) {
    const curve = new THREE.SplineCurve([
      new THREE.Vector3(-15, 0, Math.random() * i),
      new THREE.Vector3(0, -4, 0),
      new THREE.Vector3(15, 0, 0),
    ]);

    const numberLights = 20;

    const points = curve.getPoints(numberLights);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const indexParticle = new Float32Array(numberLights);

    for (let i = 0; i < numberLights; i++) {
      indexParticle[i] = i % 2;
    }
    geometry.setAttribute("index", new THREE.BufferAttribute(indexParticle, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        colorLittle: { value: new THREE.Color("#F9EDC4") },
        colorBig1: { value: new THREE.Color("#F8D18A") },
        colorBig2: { value: new THREE.Color("#FDA29C") },
        opacity: { value: 1 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
    });

    const garland = new THREE.Points(geometry, material);

    garland.position.z = Math.random() * i * 3;

    this.garlands.add(garland);
  }

  anim(progress, time) {
    this.mainWheel.rotation.z = time * 0.05;
  }
}
