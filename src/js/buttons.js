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
    this.road = options.road;
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

    if (this.debug) {
      this.returnScene();
    }

    // this.camera.position.z = 4500;
    // this.finalScene.position.y = -2000;
    // this.finalScene.rotation.y = 1.8;
  }

  init() {
    const offset = 600;
    this.createButton({ text: "", x: -(offset + offset / 2), y: 0, z: 0 });
    this.createButton({ text: "", x: -offset / 2, y: 0, z: 0 });
    this.createButton({ text: "", x: offset / 2, y: 0, z: 0 });
    this.createButton({ text: "", x: offset + offset / 2, y: 0, z: 0 });

    this.buttons.position.y = -7400;
    this.buttons.position.z = 3000;

    this.objectsToTest = this.buttonsMesh;

    this.finalScene.add(this.buttons);

    this.cityLights = this.road.cityLights;
  }

  rayCaster() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    this.intersects = this.raycaster.intersectObjects(this.objectsToTest);
  }

  checkRaycaster(obj) {
    const minPos = obj.position.x - 100;
    const maxPos = obj.position.x + 100;

    if (ios()) {
      window.addEventListener("touchstart", (event) => {
        this.mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
        if (this.intersects.length) {
          if (this.intersects[0].object.position.x > minPos && this.intersects[0].object.position.x < maxPos) {
            this.nbBtnClicked += 1;
            const indexBtn = this.objectsToTest.indexOf(obj);
            const btnClicked = this.buttonsMesh[indexBtn];
            const materialBtnClicked = this.materialsButton[indexBtn];
            const materialTextClicked = this.materialsText[indexBtn];

            if (btnClicked.position.x === this.buttonsMesh[0].position.x) {
              this.buttonOne();
            }
            gsap.to(btnClicked.position, {
              z: -200,
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
            if (this.nbBtnClicked === 4) {
              this.returnScene();
            }
          }
        }
      });
    }

    window.addEventListener("click", () => {
      if (this.intersects.length) {
        if (this.intersects[0].object.position.x > minPos && this.intersects[0].object.position.x < maxPos) {
          this.nbBtnClicked += 1;
          const indexBtn = this.objectsToTest.indexOf(obj);
          const btnClicked = this.buttonsMesh[indexBtn];
          const materialBtnClicked = this.materialsButton[indexBtn];
          const materialTextClicked = this.materialsText[indexBtn];

          if (btnClicked.position.x === this.buttonsMesh[0].position.x) {
            this.buttonOne();
          }
          gsap.to(btnClicked.position, {
            z: -200,
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
          if (this.nbBtnClicked === 4) {
            this.returnScene();
          }
        }
      }
    });
  }

  buttonOne() {
    const tl = gsap.timeline();
    this.road.textBuidling.materialsText.forEach((material) => {
      gsap.fromTo(
        [
          material.uniforms.opacity,
          this.road.textBuidling.textDance.textMaterial.uniforms.opacity,
          this.road.textBuidling.textDance.material.opacity,
        ],
        {
          value: 0,
        },
        {
          value: 1,
          yoyo: true,
          repeat: 3,
          delay: 0.1 + Math.random() * 0.2,
          duration: 0.05,
        }
      );
      gsap.fromTo(
        [
          material.uniforms.opacity,
          this.road.textBuidling.textDance.textMaterial.uniforms.opacity,
          this.road.textBuidling.textDance.material.opacity,
        ],
        {
          value: 0,
        },
        {
          delay: 0.4 + Math.random() * 0.3,
          duration: 0.05,
          value: 1,
        },
        "<"
      );
      material.uniforms.opacity.value = 1;
    });
    this.road.textBuidling.textDance.textMaterial.uniforms.opacity.value = 1;
    this.road.textBuidling.textDance.material.opacity = 1;
    console.log(this.road.textBuidling.textDance);

    // this.video.play();
  }

  returnScene() {
    this.video.play();

    const tl = gsap.timeline();

    tl.to(this.camera.position, {
      z: 3500,
      duration: 60,
      // ease: "power1.in",
    });
    tl.to(
      [this.road.city.rotation, this.buttons.rotation],
      {
        z: Math.PI,
        delay: 10,
        duration: 60,
        // ease: "power1.in",
      },
      "<"
    );
    tl.to(
      this.points.pointsMaterial.uniforms.squeeze,
      {
        value: 100,
        duration: 30,
        // ease: "power1.in",
      },
      "<"
    );

    tl.to(
      this.finalScene.rotation,
      {
        y: Math.PI,
        delay: 60,
        duration: 60,
        // ease: "power1.in",
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
      if (this.buttons.children.length === 8) {
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
