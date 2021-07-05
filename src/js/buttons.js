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
    this.moon = options.moon;
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
    this.audio = document.getElementById("audio");

    //////////////////////////////////////////////////// DEBUG
    this.debug = false;
    //////////////////////////////////////////////////// DEBUG

    window.addEventListener("mousemove", (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
  }

  init() {
    this.createButton({ text: "I CAN SHOW YOU THE NIGHT", x: 0, y: 0, z: 0 });

    this.buttons.position.y = -575;
    this.buttons.position.z = 15500;

    this.objectsToTest = this.buttonsMesh;

    this.finalScene.add(this.buttons);

    this.cityLights = this.road.cityLights;
    if (this.debug) {
      this.camera.position.y = 10500;
      this.camera.rotation.x = -0.8;
      this.finalScene.position.y = -2000;
      // this.finalScene.rotation.y = Math.PI;
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
            z: -10,
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
          z: -10,
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
    this.video.play();
    this.audio.play();
    const tl = gsap.timeline();

    tl.to(
      this.camera.position,
      {
        z: -30500,
        duration: 300,
        ease: "power1.inOut",
      },
      "<"
    );

    tl.to(
      this.moon.moonMaterial.uniforms.wide,
      {
        duration: 15,
        value: 4.5,
        ease: "linear",
      },
      "<"
    );
    tl.to(
      this.moon.moonMaterial.uniforms.opacity,
      {
        duration: 5,
        value: 1,
        ease: "linear",
      },
      "<"
    );

    if (!ios()) {
      tl.to(
        this.points.pointsMaterial2.uniforms.squeeze,
        {
          value: 30,
          duration: 10,
        },
        "<"
      );
    }

    tl.to(
      this.camera.rotation,
      {
        z: -Math.PI,
        delay: 45,
        duration: 100,
        ease: "power1.in",
      },
      "<"
    );

    tl.to(
      this.camera.rotation,
      {
        y: Math.PI,
        delay: 60,
        duration: 100,
        ease: "power2.inOut",
      },
      "<"
    );

    tl.to(
      this.finalScene.position,
      {
        z: 2000,
        duration: 20,
        // ease: "power1.in",
      },
      "<"
    );

    this.video.addEventListener("timeupdate", (event) => {
      const progress = this.video.currentTime;
      console.log(progress);
      if (progress > 205) {
        while (this.finalScene.children.length > 0) {
          this.finalScene.remove(this.finalScene.children[0]);
          setTimeout(() => {
            document.querySelector(".final").style.display = "flex";
            gsap.to(".final p", {
              opacity: 1,
              delay: 2,
              duration: 4,
            });
          }, 2500);
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
      textGeometry.center();

      const textMaterial = new THREE.MeshBasicMaterial({ opacity: 0.3, color: 0xff0000, transparent: true });

      this.materialsText.push(textMaterial);

      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

      textMesh.position.x = options.x;
      textMesh.position.y = 35 + options.y;
      textMesh.position.z = options.z;
      textMesh.scale.set(4, 4, 4);

      this.textsMesh.push(textMesh);

      const geometryButton = new THREE.CylinderGeometry(1, 1, 1, 32, 1);
      const materialButton = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          opacity: { value: 1 },
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
      button.scale.set(12, 12, 12);

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
