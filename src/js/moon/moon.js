import * as THREE from "three";

import fragment from "../shaders/moon/fragment.glsl";
import vertex from "../shaders/moon/vertex.glsl";
import TextMoon from "./textMoon";

export default class Moon {
  constructor(options) {
    this.gui = options.gui;
    this.debugObject = {};
    this.folderMoon = this.gui.addFolder("Moon");

    this.scene = options.scene;
    this.moon = new THREE.Group();

    this.textMoon = new TextMoon({ scene: this.moon, gui: this.folderMoon });
  }

  init() {
    this.addMoon();
    this.textMoon.init();

    // this.moon.position.y = -33;
    this.moon.position.y = -1200;
    this.moon.position.z = -24;
  }

  addMoon() {
    this.debugObject.moonColor1 = "#F81C39";
    this.debugObject.moonColor2 = "#EE31C3";
    this.folderMoon.addColor(this.debugObject, "moonColor1").onChange(() => {
      this.moonMaterial.color = new THREE.Color(this.debugObject.moonColor);
    });

    this.geometry = new THREE.SphereGeometry(60, 70, 70);
    this.moonMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Color(this.debugObject.moonColor1) },
        color2: { value: new THREE.Color(this.debugObject.moonColor2) },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });
    this.sphere = new THREE.Mesh(this.geometry, this.moonMaterial);

    this.sphere.position.y = -21;
    this.sphere.position.z = -2;
    this.moon.add(this.sphere);

    this.scene.add(this.moon);
  }
}
