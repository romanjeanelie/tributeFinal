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

    this.finalScene = options.finalScene;

    this.buttonsMesh = [];
    this.materialsButton = [];
    this.buttons = new THREE.Group();
    this.textsMesh = [];
    this.materialsText = [];

    this.nbBtnClicked = 0;

    this.destroy = false;

    this.tl = gsap.timeline({ paused: true });
    this.video = document.getElementById("video");
    this.audio = document.getElementById("audio");

    //////////////////////////////////////////////////// DEBUG
    this.debug = false;
    this.start = 150;
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

    if (this.debug) {
      this.returnScene();
    }

    this.cityLights = this.road.cityLights;
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
    this.tl.play();
    this.video.play();
    this.audio.play();

    let start = 0;

    if (this.debug) {
      start = this.start;
      this.tl.paused = true;
      this.video.pause();
      this.audio.pause();
    }

    const steps = {};
    steps.one = 20;
    steps.two = 57;
    steps.three = 86;
    steps.four = 112;

    this.audio.currentTime = start;
    this.video.currentTime = start;
    this.tl.to(
      this.camera.position,
      {
        z: -30500,
        duration: 306,
        ease: "power1.inOut",
      },
      "<"
    );

    this.tl.to(
      this.moon.moonMaterial.uniforms.wide,
      {
        duration: 15,
        value: 4.5,
        ease: "linear",
      },
      "<"
    );
    this.tl.to(
      this.moon.moonMaterial.uniforms.opacity,
      {
        duration: 5,
        value: 1,
        ease: "linear",
      },
      "<"
    );

    if (!ios()) {
      this.tl.to(
        this.points.pointsMaterial2.uniforms.squeeze,
        {
          value: 30,
          duration: 10,
        },
        "<"
      );
    }

    this.tl.to(
      this.camera.rotation,
      {
        z: -Math.PI,
        // z: 0,
        delay: steps.one,

        duration: 80,
        ease: "power1.in",
      },
      "<"
    );
    this.tl.to(
      this.camera.rotation,
      {
        x: -Math.PI * 0.5,
        delay: steps.two - steps.one,
        duration: 50,
        onStart: () => {
          gsap.to(this.cityLights.textLight, {
            delay: 2,
            duration: 20,
            opacity: 1,
          });
        },
      },
      "<"
    );

    this.tl.to(
      this.camera.rotation,
      {
        y: -Math.PI,
        delay: steps.three - steps.two,
        duration: 110,
      },
      "<"
    );
    this.tl.to(
      this.camera.rotation,
      {
        x: 0,
        delay: steps.four - steps.three,
        duration: 60,
      },
      "<"
    );

    this.tl.to(
      this.flower.particlesMaterial.uniforms.disperse,
      {
        value: 1,
        duration: 80,
      },
      "<"
    );

    // this.tl.to(
    //   this.finalScene.position,
    //   {
    //     z: 2000,
    //     duration: 20,
    //     // ease: "power1.in",
    //   },
    //   "<"
    // );

    this.video.addEventListener("timeupdate", (event) => {
      const progress = this.video.currentTime;
      if (progress > 204.5) {
        while (this.finalScene.children.length > 0) {
          this.finalScene.remove(this.finalScene.children[0]);
          setTimeout(() => {
            document.querySelector(".final").style.display = "flex";
            gsap.to(".final p", {
              opacity: 1,
              delay: 0,
              duration: 4,
            });
          }, 2500);
        }
      }
    });

    this.audio.addEventListener("timeupdate", (e) => {
      const progress = this.video.currentTime;
      console.log(progress);
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
      this.tl.seek(this.audio.currentTime);
    });
  }
}
