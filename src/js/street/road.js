import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import vertex from "../shaders/buildings/vertex";
import fragment from "../shaders/buildings/fragment";
import vertex2 from "../shaders/buildings/vertex2";
import fragment2 from "../shaders/buildings/fragment2";
import clamp from "../utils/clamp";

export default class Road {
  constructor(options) {
    this.debugObject = {};
    this.gui = options.gui;
    this.folderStreet = this.gui.addFolder("Street");

    this.scene = options.scene;

    this.gltfLoader = new GLTFLoader();

    this.windows = new THREE.Group();
    this.street = new THREE.Group();
  }

  init() {
    //this.createBuilding();
    this.addModelRoad();

    this.street.position.y = -3300;
    this.street.position.z = 900;

    this.street.scale.set(10, 10, 10);

    this.windows.position.y = -3300;
    this.windows.position.z = 900;

    this.windows.scale.set(10, 10, 10);

    this.scene.add(this.street);
    this.scene.add(this.windows);
  }

  addModelRoad() {
    this.material = new THREE.MeshBasicMaterial({
      color: 0x3300000,
    });

    this.gltfLoader.load("/models/city.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        this.positionBuilding = null;
        this.coordBuilding = null;

        if (child.name.includes("Building")) {
          this.positionBuilding = child.position;
          // const size = {
          //   max: child.geometry.boundingBox.max,
          //   min: child.geometry.boundingBox.min,
          // };
          if (child.type === "Group") {
            child.children.forEach(
              (el) =>
                (this.coordBuilding = {
                  max: el.geometry.boundingBox.max,
                  min: el.geometry.boundingBox.min,
                })
            );
          }
          //this.addLightWindows(this.positionBuilding, this.coordBuilding);
        }
      });

      gltf.scene.scale.set(4, 4, 4);
      //gltf.scene.rotation.y = 4.7132;

      this.street.add(gltf.scene);
    });
  }

  createBuilding() {
    this.addFaceBuilding();
    this.addBuilding();
  }

  // addFaceBuilding() {
  //   const material = new THREE.ShaderMaterial({
  //     vertexShader: vertex2,
  //     fragmentShader: fragment2,
  //   });
  //   this.gltfLoader.load("/models/face-building.glb", (gltf) => {
  //     gltf.scene.traverse((child) => {
  //       console.log(child);
  //       if (child.name.includes("Window")) {
  //         child.material = material;
  //       }
  //       // child.material = material;
  //     });
  //     gltf.scene.scale.set(4, 4, 4);
  //     gltf.scene.rotation.y = Math.PI * 0.5;
  //     //gltf.scene.rotation.z = Math.PI * 0.5;
  //     this.street.add(gltf.scene);
  //   });
  // }

  addBuilding() {
    const buidlingGeometry = new THREE.BoxBufferGeometry(5.8, 12.7, 5);
    const buildingMaterail = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
    });
    const buildingMesh = new THREE.Mesh(buidlingGeometry, buildingMaterail);

    buildingMesh.scale.set(4.7, 4.4, 5);
    buildingMesh.position.set(3.5, 0, -14);
    this.street.add(buildingMesh);
  }
  addLightWindows(position, size) {
    // this.window.scale.set(10, 10, 10);
    const limitPositions = {
      maxX: position.x + size.max.x * 2.4,
      maxY: position.y + size.max.y * 2.5,
      maxZ: position.z + size.max.z * 3.5,
      minX: position.x + size.min.x * 1.5,
      minY: position.y + size.min.y * 0.1,
    };

    this.createLightWindow(limitPositions, 4);
  }

  createLightWindow(position, count) {
    this.planeGeometry = new THREE.PlaneBufferGeometry(1, 1);
    this.planeMaterial = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: true,
    });
    // for (let i = 0; i < count; i++) {
    //   const x = clamp(position.minX, position.maxX, Math.random());
    //   const y = clamp(position.minY, position.maxY, Math.random());
    //   const z = position.maxZ;

    //   const windowBuilding = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    //   windowBuilding.position.set(x, y, z);
    //   this.windows.add(windowBuilding);
    // }
    for (let i = 0; i < 10; i++) {
      const x = clamp(position.minX, position.maxX, Math.random());
      const y = clamp(position.minY, position.maxY, Math.random());
      const z = position.maxZ;

      const windowBuilding = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
      windowBuilding.scale.set(2, 2, 2);
      windowBuilding.position.set(x, y, z);
      this.windows.add(windowBuilding);
    }
  }
}
