import gsap from "gsap/gsap-core";
import * as THREE from "three";

import fragment from "./shaders/singlePoint/fragment.glsl";
import vertex from "./shaders/singlePoint/vertex.glsl";

export default class SinglePoint {
  constructor(options) {
    this.gui = options.gui;
    this.debugObject = {};

    this.scene = options.scene;

    this.mousePosition = {
      x: 0,
      y: 0,
    };
    this.mousePositionEased = {
      x: 0,
      y: 0,
    };
  }

  init() {
    this.setColors();
    this.createPoint();
    this.mouseMove();
  }

  createPoint() {
    this.geometry = new THREE.PlaneGeometry(2, 2, 10, 10);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(this.debugObject.color1) },
        opacity: { value: 0 },
      },
      side: THREE.DoubleSide,
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      //alphaTest: 0.001,
      depthWrite: false,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.geometry.center();
    this.scene.add(this.mesh);
  }

  setColors() {
    this.debugObject.color1 = "#ff0559";
    this.gui
      .addColor(this.debugObject, "color1")
      .onChange(() => (this.material.uniforms.color1.value = new THREE.Color(this.debugObject.color1)))
      .name("singlePointColor");
  }

  mouseMove() {
    window.addEventListener("mousemove", (e) => {
      this.mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mousePosition.y = (e.clientY / window.innerHeight) * 2 - 1;

      gsap.to(this.mousePositionEased, {
        x: this.mousePosition.x,
        y: this.mousePosition.y,
        duration: 5.5,
        ease: "power2.out",
      });
    });
  }

  events() {
    this.singlePointMove();
  }

  singlePointMove() {
    this.mesh.position.set(this.mousePositionEased.x, -this.mousePositionEased.y);
  }
}
