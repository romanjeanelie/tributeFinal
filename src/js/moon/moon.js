import * as THREE from "three";

import fragment from "../shaders/moon/fragment.glsl";
import vertex from "../shaders/moon/vertex.glsl";
import TextMoon from "./textMoon";
import Atmosphere from "./atmosphere";

export default class Moon {
  constructor(options) {
    this.gui = options.gui;
    this.debugObject = {};
    this.folderMoon = this.gui.addFolder("Moon");
    this.folderMoon.open();

    this.scene = options.scene;
    this.moon = new THREE.Group();

    this.textMoon = new TextMoon({ scene: this.moon, gui: this.folderMoon });
    this.atmosphere = new Atmosphere({ scene: this.moon, gui: this.folderMoon });
  }

  init() {
    this.addMoon();
    //  this.atmosphere.init();

    this.moon.position.x = -8030;
    this.moon.position.y = 3500;
    this.moon.position.z = 1600;

    this.moon.rotation.z = -0.5;
  }

  addMoon() {
    this.debugObject.moonColor1 = "#000000";
    this.debugObject.moonColor2 = "#ff4600";
    this.debugObject.moonColor3 = "#820000";
    this.folderMoon.addColor(this.debugObject, "moonColor1").onChange(() => {
      this.moonMaterial.uniforms.color1.value = new THREE.Color(this.debugObject.moonColor1);
    });
    this.folderMoon.addColor(this.debugObject, "moonColor2").onChange(() => {
      this.moonMaterial.uniforms.color2.value = new THREE.Color(this.debugObject.moonColor2);
    });
    this.folderMoon.addColor(this.debugObject, "moonColor3").onChange(() => {
      this.moonMaterial.uniforms.color3.value = new THREE.Color(this.debugObject.moonColor3);
    });

    this.geometry = new THREE.SphereGeometry(60, 70, 70);
    this.moonMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Color(this.debugObject.moonColor1) },
        color2: { value: new THREE.Color(this.debugObject.moonColor2) },
        color3: { value: new THREE.Color(this.debugObject.moonColor3) },
        wide: { value: 25 },
        opacity: { value: 0 },
      },
      transparent: true,
      // depthWrite: false,

      vertexShader: vertex,
      fragmentShader: fragment,
    });
    this.sphere = new THREE.Mesh(this.geometry, this.moonMaterial);

    this.moon.add(this.sphere);

    this.moon.scale.set(30, 30, 30);

    this.scene.add(this.moon);
  }
}
