import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import vertex from "../shaders/buildings/windows/vertex";
import fragment from "../shaders/buildings/windows/fragment";
import vertexAntenne from "../shaders/buildings/antenne/vertexAntenne";
import fragmentAntenne from "../shaders/buildings/antenne/fragmentAntenne";
import vertex2 from "../shaders/buildings/panels/vertex2";
import fragment2 from "../shaders/buildings/panels/fragment2";
import positionsWindows from "./positionsWindows.json";

import CityLights from "./cityLights";
import TextBuilding from "./textBuilding";

import Wheel from "./wheel";
import Garland from "./garland";
import Ride from "./ride";
import Cinema from "./cinema";
import Bridge from "./bridge";
import Stadium from "./stadium";

import Landscape from "./landscape";
import ElectricPole from "./electricPole";

export default class Road {
  constructor(options) {
    this.debugObject = {};
    this.gui = options.gui;
    this.folderStreet = this.gui.addFolder("Street");

    this.scene = options.scene;

    this.loadingManager = options.loadingManager;
    this.gltfLoader = new GLTFLoader(this.loadingManager);

    this.wheelGroup = new THREE.Group();
    this.buildingsGroup = new THREE.Group();
    this.buildingsTextsGroup = new THREE.Group();
    this.buildingsLightsGroup = new THREE.Group();
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

    this.cityLights = new CityLights({ scene: this.city, gui: this.gui, loadingManager: this.loadingManager });
    this.cityLights.init();

    this.textBuilding = new TextBuilding({
      scene: this.buildingsTextsGroup,
      gui: this.gui,
      loadingManager: this.loadingManager,
    });
    this.textBuilding.init();

    this.landscape = new Landscape({ scene: this.city, gui: this.gui, loadingManager: this.loadingManager });
    this.landscape.init();

    this.electricPole = new ElectricPole({ scene: this.city, gui: this.gui, loadingManager: this.loadingManager });
    this.electricPole.init();

    this.wheel = new Wheel({ scene: this.wheelGroup, gui: this.gui, loadingManager: this.loadingManager });
    this.wheel.init();

    this.garland = new Garland({ scene: this.wheelGroup, gui: this.gui });
    this.garland.init();

    this.ride = new Ride({ scene: this.wheelGroup, gui: this.gui, loadingManager: this.loadingManager });
    this.ride.init();

    this.cinema = new Cinema({ scene: this.city, gui: this.gui, loadingManager: this.loadingManager });
    this.cinema.init();

    this.bridge = new Bridge({ scene: this.city, gui: this.gui, loadingManager: this.loadingManager });
    this.bridge.init();

    this.stadium = new Stadium({ scene: this.city, gui: this.gui, loadingManager: this.loadingManager });
    this.stadium.init();

    this.wheelGroup.scale.set(1.2, 1.2, 1.2);
    this.wheelGroup.position.x = -40;
    this.wheelGroup.position.z = 210;
    // this.wheelGroup.position.x = -65;
    // this.wheelGroup.position.z = 210;
    this.city.add(this.wheelGroup);

    this.buildingsGroup.position.x = 50;
    this.buildingsGroup.position.z = 150;
    this.city.add(this.buildingsGroup);

    this.buildingsLightsGroup.position.x = 50;
    this.buildingsLightsGroup.position.z = 150;
    this.city.add(this.buildingsLightsGroup);

    this.buildingsTextsGroup.position.x = 50;
    this.buildingsTextsGroup.position.z = 150;
    this.city.add(this.buildingsTextsGroup);

    this.city.position.x = -100;
    this.city.position.y = -7000;
    this.city.position.z = 2000;
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

    this.materialAntenne = new THREE.ShaderMaterial({
      vertexShader: vertexAntenne,
      fragmentShader: fragmentAntenne,
      transparent: true,
      uniforms: {
        time: { value: 0 },
      },
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
          // this.positionsWindow.push(child.position);
        }
        if (child.name.includes("Panel")) {
          child.material = this.materialPanel;
        }
        if (child.name.includes("pointAntenne")) {
          child.material = this.materialAntenne;
        }
      });

      this.buildingsGroup.add(gltf.scene);

      // this.downloadObjectAsJson(this.positionsWindow);
      this.createLightWindow(positionsWindows);
    });
  }

  createLightWindow(positionsWindow) {
    const count = positionsWindow.length;
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
      positions[i3 + 0] = positionsWindow[i].x;
      positions[i3 + 1] = positionsWindow[i].y;
      positions[i3 + 2] = positionsWindow[i].z;

      size[i] = 1500;
      opacity[i] = Math.random() * 1;
    }

    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute("size", new THREE.BufferAttribute(size, 1));
    pointsGeometry.setAttribute("opacity", new THREE.BufferAttribute(opacity, 1));

    const points = new THREE.Points(pointsGeometry, this.pointsMaterial);

    this.buildingsLightsGroup.add(points);
  }

  anim(progress, time) {
    this.textBuilding.anim(progress, time);
    this.wheel.anim(progress, time);
    this.ride.anim(progress, time);
    this.materialAntenne.uniforms.time.value = time;
    this.cityLights.anim(progress, time);
  }
}
