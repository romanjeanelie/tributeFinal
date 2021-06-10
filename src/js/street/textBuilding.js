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
    this.texts = [
      {
        text: "DANCE",
        posX: -45,
        posY: 22,
        posZ: 12,
        scale: 6,
        color: "#FFB200",
      },
      {
        text: "WITH ME",
        posX: -29,
        posY: 10,
        posZ: 12,
        scale: 6,
        color: "#FFB200",
      },
      {
        text: "ON THE FLOOR",
        posX: -14,
        posY: 19,
        posZ: -4,
        scale: 6,
        color: "#FFB200",
      },
      {
        text: "WE CAN DANCE",
        posX: 75,
        posY: 14,
        posZ: 29,
        rotateZ: -1.2,
        scale: 10,
        color: "#FFE53F",
      },
      {
        text: "ON THE STREETS",
        posX: 75,
        posY: 4,
        posZ: 50,
        rotateZ: -1.5,
        scale: 12,
        color: "#FFE53F",
      },
    ];
    this.loader.load("/fonts/Moniqa-Display_Bold.json", (font, options) => {
      this.texts.forEach((textOptions) => {
        this.createText(font, textOptions);
      });
    });
  }

  createText(font, options) {
    this.textGeometry = new THREE.TextGeometry(options.text, {
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

    this.textMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        activeLines: { value: 0 },
        progress: { value: 0 },
        opacity: { value: 1 },
        uColor: { value: new THREE.Color(options.color) },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
    });

    this.textMesh = new THREE.Mesh(this.textGeometry, this.textMaterial);

    this.textGeometry.center();

    this.textMesh.position.x = options.posX;
    this.textMesh.position.y = options.posY;
    this.textMesh.position.z = options.posZ;

    if (options.rotateZ) {
      this.textMesh.rotation.y = options.rotateZ;
    }
    this.textMesh.scale.set(options.scale, options.scale, options.scale);

    this.scene.add(this.textMesh);
    // this.addStructure();
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
