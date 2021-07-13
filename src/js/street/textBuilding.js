import * as THREE from "three";
import StructureText from "./structureText";

import vertex from "../shaders/buildings/text/vertex";
import fragment from "../shaders/buildings/text/fragment";

import TextDance from "./textDance";

export default class TextBuilding {
  constructor(options) {
    this.gui = options.gui;
    this.scene = options.scene;

    this.loader = new THREE.FontLoader();
    this.textureLoader = new THREE.TextureLoader();
    this.materialsText = [];
  }

  init() {
    // this.textDance = new TextDance({
    //   text: "ON",
    //   font: "Gala2",
    //   posX: -57,
    //   posY: 42,
    //   posZ: -4,
    //   rotateZ: 0,
    //   scale: 6,
    //   color: "#FF0",
    //   scene: this.scene,
    // });
    this.texts = [
      // {
      //   text: "THE",
      //   font: "Gala2",
      //   posX: -45,
      //   posY: 42,
      //   posZ: -2,
      //   scale: 6,
      //   color: "#FFFF00",
      // },
      // {
      //   text: "STREETS",
      //   font: "Gala2",
      //   posX: -44,
      //   posY: 10,
      //   posZ: 10,
      //   scale: 6,
      //   color: "#FFFF00",
      // },
      {
        text: "ON THE STREETS",
        font: "Gala2",

        posX: -30,
        posY: 4,
        posZ: 40,
        rotateZ: -0.1,
        scale: 5,
        color: "#FFE53F",
      },
      // {
      //   text: "IS A GOLDMINE",
      //   font: "Gala2",

      //   posX: -10,
      //   posY: 10,
      //   posZ: 100,
      //   rotateZ: -0.2,
      //   scale: 6,
      //   color: "#FFE53F",
      // },
      // {
      //   text: "COME BACK TO ME",
      //   font: "Gala2",

      //   posX: -50,
      //   posY: 20,
      //   posZ: 180,
      //   rotateZ: 0.2,
      //   scale: 3,
      //   color: "#FFE53F",
      // },
      // {
      //   text: "I CAN SHOW YOU THE NIGHT",
      //   font: "Gala2",

      //   posX: -26,
      //   posY: 9,
      //   posZ: 220,
      //   rotateZ: 0,
      //   scale: 3,
      //   color: "#FF0000",
      // },
    ];
    this.texts.forEach((textOptions) => {
      this.loader.load(`/fonts/${textOptions.font}.json`, (font) => {
        this.createText(font, textOptions);
      });
    });
  }

  createText(font, options) {
    this.textGeometry = new THREE.TextGeometry(options.text, {
      font: font,
      size: 0.5,
      height: 0.05,
      curveSegments: 10,
      bevelEnabled: false,
      bevelThickness: 0.04,
      bevelSize: 0.0001,
      bevelOffset: 0.006,
      bevelSegments: 0.5,
    });

    const textMaterial = new THREE.ShaderMaterial({
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

    this.materialsText.push(textMaterial);

    this.textMesh = new THREE.Mesh(this.textGeometry, textMaterial);

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
    this.materialsText.forEach((material) => {
      material.uniforms.time.value = time;
      material.uniforms.progress.value = progress;

      material.uniforms.activeLines.value = progress;
    });
  }
}
