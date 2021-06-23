import * as THREE from "three";
import { gsap } from "gsap";

// import fragment from "../shaders/moon/fragment.glsl";
// import vertex from "../shaders/moon/vertex.glsl";

export default class Buttons {
  constructor(options) {
    this.gui = options.gui;
    this.debugObject = {};

    this.loader = new THREE.FontLoader();
    this.raycaster = new THREE.Raycaster();

    this.mouse = options.mouse;
    this.camera = options.camera;
    this.scene = options.scene;
    this.finalScene = options.finalScene;

    this.buttonsMesh = [];
    this.buttons = new THREE.Group();

    this.video = document.getElementById("video");
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
    this.checkRaycaster();
  }

  rayCaster() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    this.intersects = this.raycaster.intersectObjects(this.objectsToTest);
  }

  checkRaycaster() {
    window.addEventListener("click", () => {
      if (this.intersects.length) {
        this.video.play();
        if (this.intersects[0].object.position.x > 2000) {
          gsap.to(this.finalScene.rotation, {
            y: Math.PI,
            duration: 30,
          });
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

      // const textMaterial = new THREE.ShaderMaterial({
      //   uniforms: {
      //     uStrength: { value: 0 },
      //     time: { value: 0 },
      //     progress: { value: 0 },
      //     opacity: { value: 0 },
      //     color1: { value: new THREE.Color("#ffffff") },
      //   },
      //   vertexShader: vertex,
      //   fragmentShader: fragment,
      //   transparent: true,
      //   depthWrite: false,
      // });
      const textMaterial = new THREE.MeshBasicMaterial();

      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

      textMesh.position.x = options.x;
      textMesh.position.y = 600 + options.y;
      textMesh.position.z = options.z;
      textMesh.scale.set(50, 50, 50);

      textGeometry.center();

      const geometry = new THREE.PlaneBufferGeometry(1, 1);
      const material = new THREE.MeshBasicMaterial();
      const button = new THREE.Mesh(geometry, material);

      button.position.x = options.x;
      button.position.y = options.y;
      button.position.z = options.z;
      button.scale.set(300, 300, 300);

      this.buttonsMesh.push(button);

      this.buttons.add(button, textMesh);
    });
  }
}
