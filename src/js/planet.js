import * as THREE from "three";

import fragment from "./shaders/planet/fragment.glsl";
import vertex from "./shaders/planet/vertex.glsl";

export default class Planet {
  constructor(options) {
    this.gui = options.gui;
    this.debugObject = {};
    this.folderMoon = this.gui.addFolder("Planet");
    this.folderMoon.open();

    this.scene = options.scene;
    this.planet = new THREE.Group();
  }

  init() {
    this.addPlanet();

    this.planet.position.x = 20350;
    this.planet.position.y = 13000;
    this.planet.position.z = -800;
  }

  addPlanet() {
    this.debugObject.planetColor1 = "#2b0521";
    this.debugObject.planetColor2 = "#ff0032";
    this.debugObject.planetColor3 = "#cc0f0f";
    this.folderMoon.addColor(this.debugObject, "planetColor1").onChange(() => {
      this.planetMaterial.uniforms.color1.value = new THREE.Color(this.debugObject.planetColor1);
    });
    this.folderMoon.addColor(this.debugObject, "planetColor2").onChange(() => {
      this.planetMaterial.uniforms.color2.value = new THREE.Color(this.debugObject.planetColor2);
    });
    this.folderMoon.addColor(this.debugObject, "planetColor3").onChange(() => {
      this.planetMaterial.uniforms.color3.value = new THREE.Color(this.debugObject.planetColor3);
    });
    this.geometry = new THREE.SphereGeometry(60, 70, 70);
    this.planetMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Color(this.debugObject.planetColor1) },
        color2: { value: new THREE.Color(this.debugObject.planetColor2) },
        color3: { value: new THREE.Color(this.debugObject.planetColor3) },
        wide: { value: 8.5 },

        changeColor: { value: 0 },
      },
      transparent: true,
      depthWrite: false,

      vertexShader: vertex,
      fragmentShader: fragment,
    });
    this.sphere = new THREE.Mesh(this.geometry, this.planetMaterial);

    this.planet.add(this.sphere);

    this.planet.scale.set(300, 300, 300);

    this.scene.add(this.planet);
  }
}
