import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import vertex2 from "../shaders/ride/vertex2";
import fragment2 from "../shaders/ride/fragment2";
import vertex from "../shaders/ride/vertex";
import fragment from "../shaders/ride/fragment";

export default class Stadium {
  constructor(options) {
    this.scene = options.scene;

    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();

    this.ride = new THREE.Group();
  }

  init() {
    this.addRide();

    this.ride.scale.set(1.5, 1.5, 1.5);

    this.ride.position.x = 110;
    this.ride.position.z = -60;

    this.scene.add(this.ride);
  }

  addRide() {
    this.positionsLights = [];
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
        color1: { value: new THREE.Color("#FFFEFF") },
        color2: { value: new THREE.Color("#ffffff") },
        opacity: { value: 1 },
      },
      vertexShader: vertex2,
      fragmentShader: fragment2,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
    });
    this.gltfLoader.load("/models/ride.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.type === "Mesh") {
          if (child.name.includes("Text")) {
            child.material = textMaterial;
          } else if (child.name.includes("Light")) {
            this.positionsLights.push(child.position);
            // child.material = materialLight;
          } else {
            child.material = material;
          }
        }
      });
      // this.ride.add(gltf.scene);

      this.createLights(this.positionsLights);
    });
  }

  createLights(positionsLights) {
    const count = positionsLights.length;
    this.pointsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uOpacity: { value: 1 },
        color1: { value: new THREE.Color("#E77F68") },
        color2: { value: new THREE.Color("#ffffff") },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
    });

    const pointsGeometry = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const opacity = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 0] = positionsLights[i].x;
      positions[i3 + 1] = positionsLights[i].y;
      positions[i3 + 2] = positionsLights[i].z;

      size[i] = 10000;
      opacity[i] = Math.min(0.4 + Math.random(), 0.8);
    }

    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute("size", new THREE.BufferAttribute(size, 1));
    pointsGeometry.setAttribute("opacity", new THREE.BufferAttribute(opacity, 1));

    const points = new THREE.Points(pointsGeometry, this.pointsMaterial);

    this.ride.add(points);
  }

  anim(progress, time) {
    this.ride.rotation.y += 0.001;
  }
}
