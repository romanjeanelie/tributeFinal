import * as THREE from "three";
import StructureText from "./structureText";

import vertex from "../shaders/buildings/text/vertex";
import fragment from "../shaders/buildings/text/fragment";

export default class TextBuilding {
  constructor(options) {
    this.gui = options.gui;
    this.scene = options.scene;

    this.loader = new THREE.FontLoader();
    this.textureLoader = new THREE.TextureLoader();
  }

  init() {
    this.textDance();
  }

  textDance() {
    this.loader.load("/fonts/Moniqa-Display_Bold.json", (font) => {
      this.textDanceGeometry = new THREE.TextGeometry("DANCE", {
        font: font,
        size: 0.5,
        height: 0.001,
        curveSegments: 10,
        bevelEnabled: true,
        bevelThickness: 0.005,
        bevelSize: 0.001,
        bevelOffset: 0,
        bevelSegments: 0,
      });
      this.textWithGeometry = new THREE.TextGeometry("WITH ME", {
        font: font,
        size: 0.5,
        height: 0.0001,
        curveSegments: 10,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.003,
        bevelSegments: 3,
      });
      this.textStreetGeometry = new THREE.TextGeometry("IN THE STREET", {
        font: font,
        size: 0.5,
        height: 0.0001,
        curveSegments: 10,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.003,
        bevelSegments: 3,
      });

      this.textMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          activeLines: { value: 0 },
          progress: { value: 0 },
          opacity: { value: 1 },
          uColor: { value: new THREE.Color("#FFB200") },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
      });

      this.textDance = new THREE.Mesh(this.textDanceGeometry, this.textMaterial);
      this.textWith = new THREE.Mesh(this.textWithGeometry, this.textMaterial);
      this.textStreet = new THREE.Mesh(this.textStreetGeometry, this.textMaterial);

      this.textDanceGeometry.center();
      this.textWithGeometry.center();

      this.textDance.scale.set(6, 6, 6);
      this.textDance.position.x = -45;
      this.textDance.position.y = 22;
      this.textDance.position.z = 12;

      this.textWith.scale.set(6, 6, 6);
      this.textWith.position.x = -29;
      this.textWith.position.y = 10;
      this.textWith.position.z = 12;

      this.textStreet.scale.set(6, 6, 6);
      this.textStreet.position.x = -14;
      this.textStreet.position.y = 19;
      this.textStreet.position.z = -4;

      this.scene.add(this.textDance, this.textWith, this.textStreet);
      // this.addStructure();
    });
  }

  addStructure() {
    const posDanceStruct = {
      x: this.textDance.position.x,
      y: this.textDance.position.y,
      z: this.textDance.position.z,
    };
    const posFloorStruct = {
      x: this.textFloor.position.x,
      y: this.textFloor.position.y,
      z: this.textFloor.position.z,
    };
    this.structureDance = new StructureText({ gui: this.gui, scene: this.scene, positions: posDanceStruct });
    //this.structureFloor = new StructureText({ gui: this.gui, scene: this.scene, positions: posFloorStruct });
  }

  anim(progress, time) {
    this.textMaterial.uniforms.time.value = time;
    this.textMaterial.uniforms.progress.value = progress;

    this.textMaterial.uniforms.activeLines.value = progress;
  }
}
