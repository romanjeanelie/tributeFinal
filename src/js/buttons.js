import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { gsap } from "gsap";

import ios from "./utils/ios";

import fragment from "./shaders/button/fragment.glsl";
import vertex from "./shaders/button/vertex.glsl";

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
    this.points = options.points;
    this.singlePoint = options.singlePoint;
    this.textStars = this.singlePoint.textStars;
    this.road = options.road;
    this.flower = options.flower;
    this.cityLights = options.road.cityLights;
    this.finalScene = options.finalScene;

    this.buttonsMesh = [];
    this.materialsButton = [];
    this.buttons = new THREE.Group();
    this.textsMesh = [];
    this.materialsText = [];

    this.nbBtnClicked = 0;

    this.destroy = false;

    this.video = document.getElementById("video");

    //////////////////////// DEBUG
    this.debug = false;
    //////////////////////// DEBUG

    window.addEventListener("mousemove", (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
  }

  init() {
    this.createButton({ text: "", x: 0, y: 0, z: 0 });

    this.buttons.position.y = -7300;
    this.buttons.position.z = 5300;

    this.objectsToTest = this.buttonsMesh;

    this.finalScene.add(this.buttons);

    this.cityLights = this.road.cityLights;
    if (this.debug) {
      this.camera.position.z = 3500;
      this.finalScene.position.y = -2000;
      this.finalScene.rotation.y = Math.PI;
      this.points.pointsMaterial2.uniforms.squeeze.value = 30;
      setTimeout(() => {
        this.flower.particlesMaterial.uniforms.uScale.value = 1;
      }, 1000);
    }
  }

  rayCaster() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    this.intersects = this.raycaster.intersectObjects(this.objectsToTest);
  }

  checkRaycaster(obj) {
    if (ios()) {
      window.addEventListener("touchstart", (event) => {
        this.mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
        if (this.intersects.length) {
          this.nbBtnClicked += 1;
          const btnClicked = this.buttonsMesh[0];
          const materialBtnClicked = this.materialsButton[0];
          const materialTextClicked = this.materialsText[0];

          gsap.to(btnClicked.position, {
            z: -100,
            duration: 0.5,
          });
          gsap.to(materialBtnClicked.uniforms.opacity, {
            value: 1,
            duration: 0.5,
          });
          gsap.to(materialTextClicked, {
            opacity: 1,
            duration: 0.5,
          });
          this.returnScene();
        }
      });
    }

    window.addEventListener("click", () => {
      if (this.intersects.length) {
        this.nbBtnClicked += 1;
        const btnClicked = this.buttonsMesh[0];
        const materialBtnClicked = this.materialsButton[0];
        const materialTextClicked = this.materialsText[0];

        gsap.to(btnClicked.position, {
          z: -100,
          duration: 0.5,
        });
        gsap.to(materialBtnClicked.uniforms.opacity, {
          value: 1,
          duration: 0.5,
        });
        gsap.to(materialTextClicked, {
          opacity: 1,
          duration: 0.5,
        });

        this.returnScene();
      }
    });
  }

  returnScene() {
    console.log(this.road.cityLights.pointsMaterial1.uniform);
    setTimeout(() => {
      this.video.play();
    }, 3000);
    const tl = gsap.timeline();

    tl.to(this.textStars.materialsText[3].uniforms.opacity, {
      value: 1,
      duration: 2,
    });
    tl.to(
      this.textStars.textsMesh[3].position,
      {
        z: 5000,
        duration: 60,
      },
      "<"
    );

    tl.to(
      this.camera.position,
      {
        z: 1500,
        duration: 40,
        // ease: "power1.in",
      },
      "<"
    );

    tl.to(
      this.points.pointsMaterial2.uniforms.squeeze,
      {
        value: 30,
        duration: 10,
      },
      "<"
    );
    tl.to(
      this.road.cityLights.pointsMaterial1.uniforms.move,
      {
        value: 1,
        delay: 10,
        duration: 60,
      },
      "<"
    );
    tl.to(
      this.road.cityLights.pointsMaterialBig.uniforms.move,
      {
        value: 1,
        delay: 10,
        duration: 60,
      },
      "<"
    );

    tl.to(
      this.finalScene.rotation,
      {
        y: Math.PI,
        delay: 40,
        duration: 60,
      },
      "<"
    );
    tl.to(
      this.flower.particlesMaterial.uniforms.uScale,
      {
        value: 1,
        delay: 20,
        duration: 20,
      },
      "<"
    );

    tl.to(
      this.finalScene.position,
      {
        y: -2000,
        duration: 20,
        // ease: "power1.in",
      },
      "<"
    );
    // tl.to(
    //   this.camera.position,
    //   {
    //     z: 0,
    //     delay: 9,
    //     duration: 6,
    //     ease: "power2.inout",
    //   },
    //   "<"
    // );

    this.video.addEventListener("timeupdate", (event) => {
      const progress = this.video.currentTime;
      console.log(progress);
      if (progress > 30) {
        // this.destroy = true;
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
      textGeometry.center();

      const textMaterial = new THREE.MeshBasicMaterial({ opacity: 0.1, color: 0xff0000, transparent: true });

      this.materialsText.push(textMaterial);

      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

      textMesh.position.x = options.x;
      textMesh.position.y = 200 + options.y;
      textMesh.position.z = options.z - 160;
      textMesh.scale.set(20, 20, 20);

      this.textsMesh.push(textMesh);

      const geometryButton = new THREE.CylinderGeometry(1, 1, 1, 32, 1);
      const materialButton = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          opacity: { value: 0.3 },
        },
        transparent: true,
        vertexShader: vertex,
        fragmentShader: fragment,
      });

      this.materialsButton.push(materialButton);

      const button = new THREE.Mesh(geometryButton, materialButton);

      button.rotation.x = Math.PI * 0.5;
      button.position.x = options.x;
      button.position.y = options.y;
      button.position.z = options.z;
      button.scale.set(70, 70, 70);

      this.buttonsMesh.push(button);

      this.buttons.add(button, textMesh);

      // All buttons are loaded
      if (this.buttons.children.length > 0) {
        this.objectsToTest.forEach((obj) => {
          this.checkRaycaster(obj);
        });
      }
    });
  }

  anim(progress, time) {
    this.materialsButton.forEach((material) => {
      material.uniforms.time.value = time;
    });
  }
}
