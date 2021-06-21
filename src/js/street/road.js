import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import vertex from "../shaders/buildings/windows/vertex";
import fragment from "../shaders/buildings/windows/fragment";
import vertex2 from "../shaders/buildings/panels/vertex2";
import fragment2 from "../shaders/buildings/panels/fragment2";
import positionsWindows from "./positionsWindows.json";

import CityLights from "./cityLights";
import TextBuilding from "./textBuilding";
import Teddy from "./teddy";
import Wheel from "./wheel";
import Landscape from "./landscape";
import Clouds from "./clouds";

export default class Road {
  constructor(options) {
    this.debugObject = {};
    this.gui = options.gui;
    this.folderStreet = this.gui.addFolder("Street");

    this.scene = options.scene;

    this.gltfLoader = new GLTFLoader();

    this.city = new THREE.Group();
  }

  downloadObjectAsJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  init() {
    this.addBuildings();

    this.cityLights = new CityLights({ scene: this.city, gui: this.gui });
    this.cityLights.init();

    this.textBuidling = new TextBuilding({ scene: this.city, gui: this.gui });
    this.textBuidling.init();

    // this.teddy = new Teddy({ scene: this.city, gui: this.gui });
    // this.teddy.init();

    this.landscape = new Landscape({ scene: this.city, gui: this.gui });
    this.landscape.init();

    this.clouds = new Clouds({ scene: this.city, gui: this.gui });
    this.clouds.init();

    this.wheel = new Wheel({ scene: this.city, gui: this.gui });
    this.wheel.init();

    this.addFloor();

    this.city.position.x = 5000;
    this.city.position.y = -10000;
    this.city.position.z = 4000;
    this.city.scale.set(25, 25, 25);

    this.scene.add(this.city);
  }

  addBuildings() {
    this.positionsWindow = [];
    const materialTransparent = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });

    this.materialBuilding = new THREE.MeshBasicMaterial({
      color: 0x0000000,
      side: THREE.DoubleSide,
      transparent: false,
      //depthWrite: false,
    });

    this.materialPanel = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    this.materialComputer = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      depthWrite: false,
      transparent: true,
      opacity: 0,
    });

    this.gltfLoader.load("/models/city.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        this.positionBuilding = null;
        this.coordBuilding = null;
        if (child.name.includes("Building")) {
          child.material = this.materialBuilding;
        }
        if (child.name.includes("Window")) {
          child.material = materialTransparent;
          this.positionsWindow.push(child.position);
        }
        if (child.name.includes("Panel")) {
          child.material = this.materialPanel;
        }
        if (child.name.includes("Computer")) {
          child.material = this.materialComputer;
        }
      });

      this.city.add(gltf.scene);

      this.createLightWindow(this.positionsWindow);
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

      size[i] = 600;
      opacity[i] = Math.random() * 0.6;
    }

    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute("size", new THREE.BufferAttribute(size, 1));
    pointsGeometry.setAttribute("opacity", new THREE.BufferAttribute(opacity, 1));

    const points = new THREE.Points(pointsGeometry, this.pointsMaterial);

    this.city.add(points);
  }
  addFloor() {
    this.floorGeometry = new THREE.PlaneGeometry(1, 1);
    this.floorMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
    this.floor = new THREE.Mesh(this.floorGeometry, this.floorMaterial);

    this.floor.rotation.x = Math.PI * 0.5;
    this.floor.position.y = -2;
    this.floor.scale.set(500, 1000, 500);

    this.city.add(this.floor);
  }

  anim(progress, time) {
    this.textBuidling.anim(progress, time);
    this.wheel.anim(progress, time);
  }
}
