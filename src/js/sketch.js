import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

import Animations from "./animations";
import Circle from "./circle";
import singlePoint from "./singlePoint";

export default class Sketch {
  constructor(options) {
    this.gui = new dat.GUI();
    this.debugObject = {};
    this.gui.hide();
    this.gui.hideable = true;

    this.time = 0;

    this.container = options.dom;

    this.scene = new THREE.Scene();

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.01, 10);
    //this.camera.position.z = 2;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    // this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.render(this.scene, this.camera);

    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();
    this.controls.enableDamping = true;
    this.animations = new Animations({ camera: this.camera });

    this.init();
  }

  init() {
    this.resize();
    this.setupResize();
    this.setClearColor();

    this.addObject();
    this.animations = new Animations({ camera: this.camera });
    this.render();
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  setClearColor() {
    this.debugObject.clearColor = "#000000";
    this.renderer.setClearColor(this.debugObject.clearColor);
    this.gui
      .addColor(this.debugObject, "clearColor")
      .onChange(() => this.renderer.setClearColor(this.debugObject.clearColor));
  }

  addObject() {
    this.circle = new Circle({ scene: this.scene, gui: this.gui });
    this.singlePoint = new singlePoint({ scene: this.scene, gui: this.gui });
  }

  render() {
    this.time += 0.05;

    // this.renderer.render();
    this.renderer.render(this.scene, this.camera);

    this.controls.update();

    window.requestAnimationFrame(this.render.bind(this));
  }
}
