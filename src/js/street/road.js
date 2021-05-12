import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import Palmtrees from "./palmtrees";
import vertexHL from "../shaders/headLight/vertex.glsl";
import fragmentHL from "../shaders/headLight/fragment.glsl";
import vertexSL from "../shaders/streetLight/vertex.glsl";
import fragmentSL from "../shaders/streetLight/fragment.glsl";

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
    this.addBuildingsandLamps();

    this.addHeadLights();
    this.addLampStreet();

    this.palmtrees.init();
    this.scene.add(this.street);
  }

  addModelRoad() {
    this.bakedTexture = this.textureLoader.load("/textures/street/baked11_05.jpg");
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

  addBuildingsandLamps() {
    this.gltfLoader.load("/models/buildings-with-lamps.glb", (gltf) => {
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
      vertexShader: vertexHL,
      fragmentShader: fragmentHL,
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

  addLampStreet() {
    this.lampStreet = [
      {
        x: -2.5,
        y: 4.6,
        z: 19,
        s: 1,
      },
      {
        x: 2.8,
        y: 4.6,
        z: 17,
        s: 0.98,
      },
      {
        x: 3.1,
        y: 4.55,
        z: -5,
        s: 0.8,
      },
      {
        x: -2.6,
        y: 4.5,
        z: -27.5,
        s: 0.6,
      },
    ];

    this.lampStreet.forEach((light) => {
      this.createLampStreet(light);
    });
  }

  createLampStreet(light) {
    this.debugObject.lampStreetColor = "#ffffff";
    this.gui
      .addColor(this.debugObject, "lampStreetColor")
      .onChange(
        () => (this.lampStreetMaterial.uniforms.color.value = new THREE.Color(this.debugObject.lampStreetColor))
      )
      .name("lampStreetColor");
    this.lampStreetGeometry = new THREE.PlaneBufferGeometry(1, 1, 1);
    this.lampStreetMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(this.debugObject.lampStreetColor) },
      },
      vertexShader: vertexSL,
      fragmentShader: fragmentSL,
      transparent: true,
    });

    this.lampStreet = new THREE.Mesh(this.lampStreetGeometry, this.lampStreetMaterial);

    this.lampStreet.position.x = light.x;
    this.lampStreet.position.y = light.y;
    this.lampStreet.position.z = light.z;
    this.lampStreet.scale.set(light.s, light.s, light.s);

    this.street.add(this.lampStreet);
  }
}
