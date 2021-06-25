import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { gsap } from "gsap";

import ios from "./utils/ios";

import fragment from "./shaders/button/fragment.glsl";
import vertex from "./shaders/button/vertex.glsl";
import fragmentBase from "./shaders/button/fragmentBase.glsl";
import vertexBase from "./shaders/button/vertex.glsl";

export default class Buttons {
  constructor(options) {
    this.gui = options.gui;
    this.debugObject = {};

    this.loader = new THREE.FontLoader();
    this.gltfLoader = new GLTFLoader();
    this.raycaster = new THREE.Raycaster();

    this.mouse = options.mouse;
    this.camera = options.camera;
    this.scene = options.scene;
    this.finalScene = options.finalScene;

    this.buttonsMesh = [];
    this.buttons = new THREE.Group();

    this.video = document.getElementById("video");

    this.materialsButton = [];
  }

  init() {
    this.createButton({ text: "RELIEVE", x: -3000, y: 0, z: 0 });
    this.createButton({ text: "YOUR", x: -1000, y: 0, z: 0 });
    this.createButton({ text: "BAD", x: 1000, y: 0, z: 0 });
    this.createButton({ text: "DREAM", x: 3000, y: 0, z: 0 });

    this.buttons.position.y = -9000;
    this.buttons.position.z = 35500;

    this.objectsToTest = this.buttonsMesh;

    this.scene.add(this.buttons);

    setTimeout(() => {
      this.objectsToTest.forEach((object) => {
        console.log(object.position.x);
        this.checkRaycaster(object.position.x - 500, object.position.x + 500);
      });
    }, 1000);
  }

  rayCaster() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    this.intersects = this.raycaster.intersectObjects(this.objectsToTest);
  }

  checkRaycaster(min, max) {
    if (ios()) {
      window.addEventListener("touchstart", (event) => {
        this.mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
        if (this.intersects.length) {
          this.video.play();
          if (this.intersects[0].object.position.x > min && this.intersects[0].object.position.x < max) {
            console.log("touch");
          }
        }
      });
    }
    window.addEventListener("click", () => {
      if (this.intersects.length) {
        this.video.play();
        if (this.intersects[0].object.position.x > min && this.intersects[0].object.position.x < max) {
          console.log("touch");
        }
      }
    });
  }

  addButton() {}

  createButton(options) {
    this.loader.load("/fonts/Soleil_Regular.json", (font) => {
      const textGeometry = new THREE.TextGeometry(options.text, {
        font: font,
        size: 3,
        height: 0,
        curveSegments: 10,
        bevelEnabled: false,
      });

      const textMaterial = new THREE.MeshBasicMaterial({ opacity: 0.2, transparent: true });

      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

      textMesh.position.x = options.x;
      textMesh.position.y = 700 + options.y;
      textMesh.position.z = options.z;
      textMesh.scale.set(50, 50, 50);

      textGeometry.center();

      const geometryButton = new THREE.CylinderGeometry(1, 1, 1, 32, 1);
      const materialButton = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
        },
        transparent: true,
        vertexShader: vertex,
        fragmentShader: fragment,
      });

      this.materialsButton.push(materialButton);

      const button = new THREE.Mesh(geometryButton, materialButton);

      const materialBase = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
        },
        transparent: true,
        vertexShader: vertexBase,
        fragmentShader: fragmentBase,
      });
      this.gltfLoader.load("/models/baseBtn.glb", (gltf) => {
        gltf.scene.traverse((child) => {
          child.material = materialBase;
        });
        gltf.scene.rotation.x = Math.PI * 0.36;
        gltf.scene.scale.set(330, 330, 330);
        gltf.scene.position.x = options.x;
        gltf.scene.position.y = options.y;
        gltf.scene.position.z = options.z - 10;

        this.buttons.add(gltf.scene);
      });

      button.rotation.x = Math.PI * 0.36;
      button.position.x = options.x;
      button.position.y = options.y;
      button.position.z = options.z;
      button.scale.set(200, 200, 200);

      this.buttonsMesh.push(button);

      this.buttons.add(button, textMesh);
    });
  }

  anim(progress, time) {
    this.materialsButton.forEach((material) => {
      material.uniforms.time.value = time;
    });
  }
}
