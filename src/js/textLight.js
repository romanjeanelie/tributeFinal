import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import * as THREE from "three";

import { gsap } from "gsap";

import vertex from "./shaders/textLight/vertex.glsl";
import fragment from "./shaders/textLight/fragment.glsl";

export default class TextLight {
  constructor(options) {
    this.loadingManager = options.loadingManager;
    this.gltfLoader = new GLTFLoader(this.loadingManager);

    this.text = new THREE.Group();
    this.scene = options.scene;

    this.opacity = 0;
    this.disperse = 0;
  }

  init() {
    this.addText();

    // this.text.children[1].position.y = 50;
    this.text.scale.set(75, 75, 75);
    this.text.rotation.y = Math.PI;
    this.text.position.x = 150;
    this.text.position.y = 0;
    this.text.position.z = 280;
    this.scene.add(this.text);
  }

  addText() {
    this.gltfLoader.load("/models/text.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.type === "Mesh") {
          this.createParticles(child);
        }
      });

      /*------------------------------
      Particles Material
      ------------------------------*/
    });
  }

  createParticles(mesh) {
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    mesh.material = material;
    this.geometry = mesh.geometry;

    const sampler = new MeshSurfaceSampler(mesh).build();
    const numParticles = 3000;
    // const numParticles = 200000;

    this.particlesGeometry = new THREE.BufferGeometry();
    const particlesPosition = new Float32Array(numParticles * 3);
    const particlesOpacity = new Float32Array(numParticles);
    const particlesSize = new Float32Array(numParticles);

    for (let i = 0; i < numParticles; i++) {
      const newPosition = new THREE.Vector3();
      sampler.sample(newPosition);
      particlesPosition.set([newPosition.x, newPosition.y, newPosition.z], i * 3);
      particlesOpacity[i] = Math.random();

      particlesSize[i] = 5000 + Math.random() * 30000;
    }

    this.particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particlesPosition, 3));
    this.particlesGeometry.setAttribute("aOpacity", new THREE.BufferAttribute(particlesOpacity, 1));
    this.particlesGeometry.setAttribute("size", new THREE.BufferAttribute(particlesSize, 1));

    /*------------------------------
      Particles
      ------------------------------*/

    this.particlesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: 1 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        color1: { value: new THREE.Color("#E77F68") },
        color2: { value: new THREE.Color("#ffffff") },
        uOpacity: { value: this.opacity },
        disperse: { value: this.disperse },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial);

    if (mesh.name === "Stop") {
      this.particles.position.z = -1.5;
    }

    this.text.add(this.particles);
    // this.text.add(mesh);
  }

  anim(progress, time) {
    if (this.particlesMaterial === undefined) return;
    this.particlesMaterial.uniforms.uOpacity.value = this.opacity;
    this.particlesMaterial.uniforms.disperse.value = this.disperse;
    this.particlesMaterial.uniforms.uTime.value = time;
  }
}
