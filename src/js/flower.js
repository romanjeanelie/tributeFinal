import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import * as THREE from "three";

import { gsap } from "gsap";

import vertex from "./shaders/flower/vertex.glsl";
import fragment from "./shaders/flower/fragment.glsl";

export default class Flower {
  constructor(options) {
    this.gltfLoader = new GLTFLoader();

    this.flower = new THREE.Group();
    this.scene = options.scene;
  }

  init() {
    this.addFlower();
    this.flower.scale.set(40, 40, 40);
    this.flower.rotation.x = 1;
    this.flower.position.y = 900;
    this.flower.position.z = 9500;
    this.scene.add(this.flower);
  }

  addFlower() {
    this.gltfLoader.load("/models/teddy.glb", (gltf) => {
      this.mesh = gltf.scene.children[0].children[0];

      this.material = new THREE.MeshBasicMaterial({
        color: "white",
        wireframe: true,
      });

      this.mesh.material = this.material;

      this.geometry = this.mesh.geometry;

      /*------------------------------
      Particles Material
      ------------------------------*/
      this.particlesMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uColor1: { value: new THREE.Color(this.color1) },
          uColor2: { value: new THREE.Color(this.color2) },
          uTime: { value: 0 },
          uScale: { value: 0 },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      /*------------------------------
      Particles Geometry
      ------------------------------*/
      const sampler = new MeshSurfaceSampler(this.mesh).build();
      const numParticles = 4000;
      this.particlesGeometry = new THREE.BufferGeometry();
      const particlesPosition = new Float32Array(numParticles * 3);
      const particlesRandomness = new Float32Array(numParticles * 3);

      for (let i = 0; i < numParticles; i++) {
        const newPosition = new THREE.Vector3();
        sampler.sample(newPosition);
        particlesPosition.set([newPosition.x, newPosition.y, newPosition.z], i * 3);
        particlesRandomness.set([Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1], i * 3);
      }

      this.particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particlesPosition, 3));
      this.particlesGeometry.setAttribute("aRandom", new THREE.BufferAttribute(particlesRandomness, 3));

      /*------------------------------
      Particles
      ------------------------------*/
      this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial);

      this.flower.add(this.particles);
    });
  }

  anim(progress, time) {
    if (this.particlesMaterial === undefined) return;
    this.particlesMaterial.uniforms.uTime.value = time;
  }
}
