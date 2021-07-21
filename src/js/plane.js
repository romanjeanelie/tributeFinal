import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

import fragment from "./shaders/textPlane/fragment.glsl";
import vertex from "./shaders/textPlane/vertex.glsl";

import fragment2 from "./shaders/plane/fragment.glsl";
import vertex2 from "./shaders/plane/vertex.glsl";

export default class Plane {
  constructor(options) {
    this.gltfLoader = new GLTFLoader();
    this.loader = new THREE.FontLoader();

    this.scene = options.scene;

    this.plane = new THREE.Group();
    this.textsMesh = [];
    this.materialsText = [];
  }

  init() {
    this.addPlane();

    const textOptions = {
      text: "I CAN SHOW YOU THE NIGHT",
      posX: 60,
      posY: 2,
      posZ: 2,
      scale: 5,
      color: "#F9A5D9",
      color2: "#FFa0ff",
    };
    this.createText(textOptions);

    this.createRopes();

    this.createLights();

    this.plane.scale.set(40, 40, 40);
    this.plane.position.set(1200, -2100, 10600);

    this.scene.add(this.plane);
  }

  addPlane() {
    this.material = new THREE.MeshBasicMaterial({ color: 0x000000 });

    this.gltfLoader.load("/models/plane.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        child.material = this.material;
      });

      gltf.scene.rotation.y = 1.6;

      this.plane.add(gltf.scene);
    });
  }

  createText(options) {
    this.loader.load("/fonts/Moniqa-ExtBold.json", (font) => {
      const textGeometry = new THREE.TextGeometry(options.text, {
        font: font,
        size: 1,
        height: 0,
        curveSegments: 10,
        bevelEnabled: false,
      });

      const textMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uStrength: { value: 0 },
          time: { value: 0 },
          activeLines: { value: 0 },
          progress: { value: 0 },
          opacity: { value: this.opacity },
          uColor: { value: new THREE.Color(options.color) },
          uColor2: { value: new THREE.Color(options.color2 ? options.color2 : options.color) },
          squeeze: { value: 0 },
          wide: { value: 1 },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
        // transparent: true,
        // depthWrite: false,
      });

      this.materialsText.push(textMaterial);

      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

      textMesh.position.x = options.posX;
      textMesh.position.y = options.posY;
      textMesh.position.z = options.posZ;

      if (options.rotY) {
        textMesh.rotation.y = options.rotY;
      }
      textMesh.scale.set(options.scale, options.scale, options.scale);

      this.textsMesh.push(textMesh);

      textGeometry.center();

      this.plane.add(textMesh);
    });
  }

  createRopes() {
    const geometry1 = new THREE.PlaneGeometry(20, 0.2);
    const geometry2 = new THREE.PlaneGeometry(58, 0.2);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000 });

    const rope1 = new THREE.Mesh(geometry1, material);
    const rope2 = new THREE.Mesh(geometry1, material);

    const longRope1 = new THREE.Mesh(geometry2, material);
    const longRope2 = new THREE.Mesh(geometry2, material);

    rope1.rotation.z = 0.1;
    rope1.position.x = 20;
    rope1.position.y = 3;

    rope2.rotation.z = -0.1;
    rope2.position.x = 20;
    rope2.position.y = 1;

    longRope1.position.x = 59;
    longRope1.position.y = 4;

    longRope2.position.x = 59;
    longRope2.position.y = 0;

    this.plane.add(rope1, rope2, longRope1, longRope2);
  }

  createLights() {
    const geometry = new THREE.PlaneBufferGeometry(0.5, 0.5);

    const materialLittleLight = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        color1: { value: new THREE.Color("#ff0000") },
        color2: { value: new THREE.Color("#ffffff") },
        opacity: { value: 1 },
      },
      vertexShader: vertex2,
      fragmentShader: fragment2,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
    });

    const materialBigLight = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        color1: { value: new THREE.Color("#ffffff") },
        color2: { value: new THREE.Color("#ffffff") },
        opacity: { value: 1 },
      },
      vertexShader: vertex2,
      fragmentShader: fragment2,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
    });

    const littleLight = new THREE.Mesh(geometry, materialLittleLight);

    const bigLight = new THREE.Mesh(geometry, materialBigLight);

    littleLight.position.x = 7.2;
    littleLight.position.y = 2;
    littleLight.position.z = 7.5;

    bigLight.position.x = 8.15;
    bigLight.position.y = 2;
    bigLight.position.z = 7.3;

    this.plane.add(littleLight, bigLight);
  }

  anim(progress, time) {
    this.materialsText.forEach((material) => {
      material.uniforms.time.value = time;
    });
    this.plane.position.x -= 0.5;
  }
}
