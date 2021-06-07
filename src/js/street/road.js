import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import vertex from "../shaders/buildings/windows/vertex";
import fragment from "../shaders/buildings/windows/fragment";
import vertex2 from "../shaders/buildings/panels/vertex2";
import fragment2 from "../shaders/buildings/panels/fragment2";

import clamp from "../utils/clamp";

export default class Road {
  constructor(options) {
    this.debugObject = {};
    this.gui = options.gui;
    this.folderStreet = this.gui.addFolder("Street");

    this.scene = options.scene;

    this.gltfLoader = new GLTFLoader();

    this.city = new THREE.Group();
  }

  init() {
    this.addBuildings();

    this.city.position.y = -3300;
    this.city.position.z = 900;
    this.city.scale.set(10, 10, 10);

    this.scene.add(this.city);
  }

  addBuildings() {
    const material = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });

    this.materialBuilding = new THREE.MeshBasicMaterial({
      color: 0x0000000,
      side: THREE.DoubleSide,
      transparent: false,
    });

    this.materialPanel = new THREE.ShaderMaterial({
      vertexShader: vertex2,
      fragmentShader: fragment2,
      color: 0x00000ff,
      side: THREE.DoubleSide,
      transparent: true,
    });

    this.gltfLoader.load("/models/city.glb", (gltf) => {
      let positionsWindow = [];
      let positionsPanel = [];
      let boxBuilding = [];

      gltf.scene.traverse((child) => {
        this.positionBuilding = null;
        this.coordBuilding = null;
        if (child.name.includes("Building")) {
          child.material = this.materialBuilding;
          console.log(child.geometry.boundingBox);
          boxBuilding.push(child.geometry.boundingBox);
        }
        if (child.name.includes("Window")) {
          // Add material to make windows transparent
          child.material = material;
          positionsWindow.push(child.position);
        }
        if (child.name.includes("Panel")) {
          // Add material to make windows transparent
          child.material = this.materialPanel;
        }
      });

      this.city.add(gltf.scene);

      this.createLightWindow(positionsWindow);
      // this.addLightPanel(positionsPanel, boxBuilding);
    });
  }

  createLightWindow(positionsWindow) {
    const count = positionsWindow.length;
    this.pointsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        opacity: { value: 1 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      //depthWrite: false,
    });

    const pointsGeometry = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const opacity = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 0] = positionsWindow[i].x;
      positions[i3 + 1] = positionsWindow[i].y;
      positions[i3 + 2] = positionsWindow[i].z;

      size[i] = 500;
      opacity[i] = Math.random() * 0.6;
    }

    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute("size", new THREE.BufferAttribute(size, 1));
    pointsGeometry.setAttribute("opacity", new THREE.BufferAttribute(opacity, 1));

    const points = new THREE.Points(pointsGeometry, this.pointsMaterial);

    this.city.add(points);
  }

  addLightPanel(panelPosition, boxPanel) {
    panelPosition.forEach((panel, i) => {
      this.createLightPanel(panel, boxPanel[i]);
    });
  }

  createLightPanel(positionsPanel, boxPanel) {
    const count = 1000;
    this.pointsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        opacity: { value: 1 },
      },
      vertexShader: vertex2,
      fragmentShader: fragment2,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pointsGeometry = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const opacity = new Float32Array(count);

    const factorX = 0.98;
    const limitX = {
      min: positionsPanel.x + boxPanel.min.x * factorX,
      max: positionsPanel.x + boxPanel.max.x * factorX,
    };
    const limitY = {
      min: positionsPanel.y,
      max: positionsPanel.y + 0.2,
    };

    for (let i = 0; i < count * 3; i++) {
      const i3 = i * 3;
      positions[i3 + 0] = clamp(limitX.min, limitX.max, Math.random());
      positions[i3 + 1] = clamp(limitY.min, limitY.max, Math.random());
      positions[i3 + 2] = positionsPanel.z;

      size[i] = 1000;
      opacity[i] = Math.random() * 0.7;
    }

    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute("size", new THREE.BufferAttribute(size, 1));
    pointsGeometry.setAttribute("opacity", new THREE.BufferAttribute(opacity, 1));

    const points = new THREE.Points(pointsGeometry, this.pointsMaterial);

    this.city.add(points);
  }
}
