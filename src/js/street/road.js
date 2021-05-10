import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import Palmtrees from "./palmtrees";
import vertex from "../shaders/headLight/vertex.glsl";
import fragment from "../shaders/headLight/fragment.glsl";

export default class Road {
  constructor(options) {
    this.debugObject = {};
    this.gui = options.gui;
    this.gui.hide();

    this.scene = options.scene;

    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();

    this.street = new THREE.Group();
    this.palmtrees = new Palmtrees({ scene: this.street, gui: this.gui });
  }

  init() {
    this.addModelRoad();
    this.palmtrees.init();
    this.scene.add(this.street);
    this.addHeadLights();
  }

  addModelRoad() {
    this.bakedTexture = this.textureLoader.load("/textures/street/baked10_05-3.jpg");
    this.bakedTexture.flipY = false;
    this.bakedMaterial = new THREE.MeshBasicMaterial({ map: this.bakedTexture });

    this.gltfLoader.load("/models/street-with-car.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        child.material = this.bakedMaterial;
      });
      gltf.scene.rotation.y = 4.7132;

      this.street.add(gltf.scene);

      this.street.position.y = -50.5;
      this.street.position.z = 65;
    });
  }

  addHeadLights() {
    this.headLights = [
      {
        Lx: 1.5,
        Rx: 2.4,
        y: 0.4,
        z: 24.6,
        s: 0.35,
      },
      {
        Lx: -2.5,
        Rx: -1.7,
        y: 0.4,
        z: 24.6,
        s: 0.35,
      },
    ];

    this.headLights.forEach((light) => {
      this.createHeadLights(light);
    });
  }

  createHeadLights(light) {
    this.debugObject.headLightColor = "#ff0364";
    this.gui
      .addColor(this.debugObject, "headLightColor")
      .onChange(() => (this.headLightMaterial.uniforms.color.value = new THREE.Color(this.debugObject.headLightColor)))
      .name("headLightColor");

    this.headLightGeometry = new THREE.PlaneBufferGeometry(1, 1, 1);
    this.headLightMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(this.debugObject.headLightColor) },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
    });

    this.headLightL = new THREE.Mesh(this.headLightGeometry, this.headLightMaterial);
    this.headLightR = new THREE.Mesh(this.headLightGeometry, this.headLightMaterial);

    const scale = light.s;

    this.headLightL.scale.set(scale, scale, scale);
    this.headLightL.position.x = light.Lx;
    this.headLightL.position.y = light.y;
    this.headLightL.position.z = light.z;

    this.headLightR.scale.set(scale, scale, scale);
    this.headLightR.position.x = light.Rx;
    this.headLightR.position.y = light.y;
    this.headLightR.position.z = light.z;

    this.street.add(this.headLightR, this.headLightL);
  }
}
