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
    this.textsMesh = [];

    this.opacity = 1;
    this.disperse = 0;
  }

  init() {
    this.textDance = new TextDance({
      text: "DANCE",
      font: "Gala2",
      posX: -61,
      posY: 22,
      posZ: 0,
      rotateZ: 0,
      scale: 6,
      color: "#FF0962",
      scene: this.scene,
    });
    this.texts = [
      {
        text: "WITH ME",
        font: "Gala2",
        posX: -40,
        posY: 15,
        posZ: 15,
        scale: 6,
        color: "#FF0962",
      },
      {
        text: "ON THE FLOOR",
        font: "Gala2",
        posX: -14,
        posY: 20,
        posZ: 10,
        scale: 6,
        color: "#FF0962",
      },
      {
        text: "I WANT",
        font: "Gala2",

        posX: 25,
        posY: 35,
        posZ: 50,
        rotateZ: -0.5,
        scale: 10,
        color: "#FF00DE",
      },
      {
        text: "TO FEEL YOU",
        font: "Gala2",
        posX: 25,
        posY: 27,
        posZ: 50,
        rotateZ: -0.5,
        scale: 10,
        color: "#FF00DE",
      },
      // {
      //   text: "come back to me",
      //   font: "Dancing-Script",

      //   posX: -90,
      //   posY: 14,
      //   posZ: 110,
      //   rotateZ: 0.2,
      //   scale: 7,
      //   color: "#FF00FF",
      // },
      {
        text: "your heart is a goldmine",
        font: "Codystar",

        posX: -50,
        posY: 30,
        posZ: 175,
        scale: 3,
        color: "#FF9000",
      },
      {
        text: "larger than me",
        font: "Codystar",

        posX: -50,
        posY: 27,
        posZ: 175,
        scale: 3,
        color: "#FF9000",
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
        uColor: { value: new THREE.Color(options.color) },
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
