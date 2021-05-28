import * as THREE from "three";
import StructureText from "./structureText";

export default class TextMoon {
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
    this.matcapTexture1 = this.textureLoader.load("/textures/moon/matcap1.png");
    this.matcapTexture2 = this.textureLoader.load("/textures/moon/matcap2.png");
    this.loader.load("/fonts/Moniqa-Display_Bold.json", (font) => {
      this.textDanceGeometry = new THREE.TextGeometry("DANCE WITH ME", {
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
      this.textFloorGeometry = new THREE.TextGeometry("ON THE FLOOR", {
        font: font,
        size: 0.5,
        height: 0.0001,
        curveSegments: 10,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.003,
        bevelSegments: 3,
      });

      this.textDanceMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
      });
      this.textFloorMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff,
      });

      this.textDance = new THREE.Mesh(this.textDanceGeometry, this.textDanceMaterial);
      this.textFloor = new THREE.Mesh(this.textFloorGeometry, this.textFloorMaterial);

      this.textDanceGeometry.center();
      this.textFloorGeometry.center();

      this.textDance.scale.set(6, 6, 6);
      this.textDance.position.y = 39;
      this.textDance.position.z = 20;

      this.textFloor.scale.set(10, 10, 10);
      this.textFloor.position.y = -10;
      this.textFloor.position.z = 58;

      this.scene.add(this.textDance, this.textFloor);
      this.addStructure();
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
}
