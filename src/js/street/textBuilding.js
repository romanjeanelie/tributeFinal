import * as THREE from "three";
import StructureText from "./structureText";

import vertex from "../shaders/buildings/text/vertex";
import fragment from "../shaders/buildings/text/fragment";

import TextDance from "./textDance";

export default class TextBuilding {
  constructor(options) {
    this.gui = options.gui;
    this.scene = options.scene;

    this.loadingManager = options.loadingManager;
    this.loader = new THREE.FontLoader(this.loadingManager);
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);

    this.materialsText = [];
    this.textsMesh = [];

    this.opacity = 1;
    this.disperse = 0;
  }

  init() {
    this.textDance = new TextDance({
      text: "DANCE",
      font: "Gala2",
      posX: -59,
      posY: 22,
      posZ: 15,
      rotateZ: 0,
      scale: 6,
      color1: "#E8E77F",
      color2: "#CD6F3C",
      scene: this.scene,
    });
    this.texts = [
      {
        text: "WITH ME",
        font: "Gala2",
        posX: -44,
        posY: 12,
        posZ: 15,
        scale: 6,
        color1: "#E8E77F",
        color2: "#CD6F3C",
      },
      {
        text: "ON THE FLOOR",
        font: "Gala2",
        posX: -14,
        posY: 20,
        posZ: 3,
        scale: 6,
        color1: "#E8E77F",
        color2: "#CD6F3C",
      },
      {
        text: "I want",
        font: "Milestone",

        posX: 5,
        posY: 20,
        posZ: 40,
        rotateZ: -0.5,
        scale: 8,
        color: "#F76E3B",
        color2: "#FF1B7E",
      },
      {
        text: "to feel you",
        font: "Milestone",
        posX: 5,
        posY: 12,
        posZ: 40,
        rotateZ: -0.5,
        scale: 8,
        color: "#F76E3B",
        color2: "#FF1B7E",
      },
      {
        text: "come back to me",
        font: "Score Board_Regular",

        posX: -100,
        posY: 14,
        posZ: 90,
        rotateZ: 0.2,
        scale: 4,
        color1: "#DEC2B0",
        color2: "#DEC2B0",
      },
      {
        text: "YOUR HEART IS A GOLDMINE",
        font: "Oswald_Regular",
        posX: -45,
        posY: 27,
        posZ: 175,
        rotateZ: 0.2,
        scale: 4,
        color1: "#E600FF",
        color2: "#FF0077",
      },
      {
        text: "LARGER THAN ME",
        font: "Oswald_Regular",
        posX: -45,
        posY: 23,
        posZ: 175,
        rotateZ: 0.2,
        scale: 4,
        color1: "#E600FF",
        color2: "#FF0077",
      },
    ];
    this.texts.forEach((textOptions) => {
      this.loader.load(`/fonts/${textOptions.font}.json`, (font) => {
        this.createText(font, textOptions);
      });
    });
  }

  createText(font, options) {
    const textGeometry = new THREE.TextGeometry(options.text, {
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
        uColor1: { value: new THREE.Color(options.color1) },
        uColor2: { value: new THREE.Color(options.color2) },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
    });

    this.materialsText.push(textMaterial);

    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    textGeometry.center();

    textMesh.position.x = options.posX;
    textMesh.position.y = options.posY;
    textMesh.position.z = options.posZ;

    if (options.rotateZ) {
      textMesh.rotation.y = options.rotateZ;
    }
    textMesh.scale.set(options.scale, options.scale, options.scale);

    this.textsMesh.push(textMesh);

    this.scene.add(textMesh);
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
      material.uniforms.opacity.value = this.opacity;
    });

    this.textsMesh.forEach((mesh, i) => {
      mesh.position.y += time * 0.0012 * this.disperse;
      mesh.position.x += i % 2 === 0 ? time * 0.0006 * this.disperse : -(time * 0.0006 * this.disperse);
      mesh.position.z += time * 0.001 * this.disperse;
      mesh.rotation.y += time * 0.00001 * this.disperse;
      mesh.rotation.x += time * 0.001 * this.disperse * i * 0.01;
    });
  }
}
