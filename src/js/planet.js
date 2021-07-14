import * as THREE from "three";

import fragment from "./shaders/planet/fragment.glsl";
import vertex from "./shaders/planet/vertex.glsl";

export default class Planet {
  constructor(options) {
    this.gui = options.gui;
    this.debugObject = {};
    this.folderPlanet = this.gui.addFolder("Planet");
    this.folderPlanet.open();

    this.scene = options.scene;
    this.planet = new THREE.Group();
  }

  init() {
    this.addPlanet();

    this.planet.position.x = 25350;
    this.planet.position.y = 3000;
    this.planet.position.z = 70500;

    this.planet.rotation.y = Math.PI * 1.1;
    this.planet.rotation.z = Math.PI * 1;
  }

  addPlanet() {
    this.debugObject.planetColor1 = "#3a000a";
    this.debugObject.planetColor2 = "#ffd5d5";
    this.debugObject.planetColor3 = "#cc0f0f";
    this.folderPlanet.addColor(this.debugObject, "planetColor1").onChange(() => {
      this.planetMaterial.uniforms.color1.value = new THREE.Color(this.debugObject.planetColor1);
    });
    this.folderPlanet.addColor(this.debugObject, "planetColor2").onChange(() => {
      this.planetMaterial.uniforms.color2.value = new THREE.Color(this.debugObject.planetColor2);
    });
    this.folderPlanet.addColor(this.debugObject, "planetColor3").onChange(() => {
      this.planetMaterial.uniforms.color3.value = new THREE.Color(this.debugObject.planetColor3);
    });
    this.geometry = new THREE.SphereGeometry(60, 70, 70);
    this.planetMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Color(this.debugObject.planetColor1) },
        color2: { value: new THREE.Color(this.debugObject.planetColor2) },
        color3: { value: new THREE.Color(this.debugObject.planetColor3) },
        wide: { value: 6.5 },
        opacity: { value: 1 },

        changeColor: { value: 1 },
      },
      transparent: true,
      depthWrite: false,

      vertexShader: vertex,
      fragmentShader: fragment,
    });
    this.sphere = new THREE.Mesh(this.geometry, this.planetMaterial);

    this.planet.add(this.sphere);

    this.planet.scale.set(400, 400, 400);

    this.scene.add(this.planet);
  }
}
