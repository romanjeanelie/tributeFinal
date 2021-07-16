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

    this.sizes = options.sizes;
    this.mouse = options.mouse;
    this.camera = options.camera;
    this.scene = options.scene;
    this.points = options.points;
    this.singlePoint = options.singlePoint;
    this.moon = options.moon;
    this.road = options.road;
    this.textStars = this.singlePoint.textStars;
    this.flower = options.flower;
    this.sky = options.sky;
    this.backSky = options.backSky;
    this.screen = options.screen;
    this.textGod = options.textGod;
    this.textFinal = options.textFinal;

    this.finalScene = options.finalScene;

    this.btnPlay = document.querySelector(".play");

    this.buttonsMesh = [];
    this.materialsButton = [];
    this.buttons = new THREE.Group();
    this.textsMesh = [];
    this.materialsText = [];

    this.nbBtnClicked = 0;

    this.destroy = false;

    this.tl = gsap.timeline({ paused: true });
    this.audio = document.getElementById("audio");

    //////////////////////////////////////////////////// DEBUG
    this.debug = false;
    this.start = 200;
    //////////////////////////////////////////////////// DEBUG

    window.addEventListener("mousemove", (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
  }

  init() {
    this.createButton({ text: "PLAY", x: 0, y: 0, z: 0 });

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
    this.btnPlay.addEventListener("click", () => {
      this.nbBtnClicked += 1;
      const btnClicked = this.buttonsMesh[0];
      const textClicked = this.textsMesh[0];
      const materialBtnClicked = this.materialsButton[0];
      const materialTextClicked = this.materialsText[0];

      gsap.to(btnClicked.position, {
        z: -10,
        duration: 0.5,
      });
      gsap.to(textClicked.position, {
        z: 0,
        duration: 0.5,
      });

      // materialTextClicked.color = 0xff0000;

      gsap.to(materialBtnClicked.uniforms.changeColor, {
        value: 0.8,
        duration: 0.5,
      });
      gsap.to(materialTextClicked, {
        opacity: 0.2,
        duration: 0.5,
      });

      this.returnScene();
    });
  }

  returnScene() {
    // this.audio.muted = true;
    this.tl.play();
    this.audio.play();
    let start = 0;
    if (this.debug) {
      this.backSky.material.opacity = 0;
      this.textGod.opacity.value = 1;
      // this.sky.material.uniforms.opacity.value = 0;

      start = this.start;
      this.tl.paused = true;
      this.audio.pause();
      setTimeout(() => {
        this.textStars.textsMesh[0].position.y += 500;
        this.road.pointsMaterial.uniforms.opacity.value = 0;
        this.textStars.opacity = 0;
        this.road.textBuilding.opacity = 0;
        this.flower.particlesMaterial.uniforms.disperse.value = 0;
        this.flower.particlesMaterial.uniforms.changeColor.value = 0;
      }, 500);
    }

    const steps = {};
    steps.one = 15;
    steps.two = 20;
    steps.three = 35;
    steps.four = 57;
    steps.five = 86;
    steps.six = 112;

    this.audio.currentTime = start;
    this.tl.to(
      this.sky,
      {
        opacity: 0,
        duration: 20,
      },
      "<"
    );

    this.tl.to(
      this.camera.position,
      {
        z: -30500,
        duration: 306,
        ease: "power1.inOut",
      },
      "<"
    );

    if (!this.debug) {
      this.tl.to(
        this.flower.particlesMaterial.uniforms.scaleSize,
        {
          value: 1.5,
          duration: 7,
          ease: "power1.inOut",
        },
        "<"
      );
    }

    this.tl.to(
      this.moon.moonMaterial.uniforms.wide,
      {
        duration: 23,
        value: 3.5,
        ease: "power2.out",
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

    this.tl.to(
      this.textFinal.materialsText[0].uniforms.opacity,
      {
        value: 0.5,
        delay: steps.one,
        duration: 16,
        ease: "power1.in",
      },
      "<"
    );

    this.tl.to(
      this.textStars,
      {
        disperse: 1,
        duration: 130,
      },
      "<"
    );
    this.tl.to(
      this.road.textBuilding,
      {
        disperse: 1,
        duration: 130,
      },
      "<"
    );

    this.tl.to(
      this.camera.rotation,
      {
        z: -Math.PI,
        // z: 0,
        delay: steps.two - steps.one,

        duration: 80,
        ease: "power1.inOut",
      },
      "<"
    );

    this.tl.to(
      this.textFinal.materialsText[0].uniforms.opacity,
      {
        value: 0,
        delay: steps.three - steps.two,
        duration: 30,
      },
      "<"
    );
    this.tl.to(
      this.textFinal.materialsText[1].uniforms.opacity,
      {
        value: 1,
        duration: 30,
      },
      "<"
    );
    this.tl.to(
      this.camera.rotation,
      {
        x: -Math.PI * 0.5,
        delay: steps.four - steps.three,
        duration: 50,
        ease: "power1.out",
      },
      "<"
    );
    if (!this.debug) {
      this.tl.to(
        this.cityLights.textLight,
        {
          duration: 18,
          opacity: 1,
          ease: "power1.in",
        },
        "<"
      );
    }
    this.tl.to(
      this.camera.rotation,
      {
        y: -Math.PI,
        delay: steps.five - steps.four,
        duration: 110,
        onStart: () => {
          gsap.to(this.flower.particlesMaterial.uniforms.disperse, {
            value: 0,
            duration: 107,
            ease: "power1.inOut",
          });
          gsap.to(this.flower.particlesMaterial.uniforms.changeColor, {
            value: 0,
            duration: 30,
            ease: "power2.in",
          });
        },
      },
      "<"
    );
    this.tl.to(
      this.textFinal.materialsText[1].uniforms.opacity,
      {
        value: 0,
        duration: 1,
      },
      "<"
    );
    if (!this.debug) {
      this.tl.to(
        this.cityLights.textLight,
        {
          duration: 10,
          opacity: 0,
        },
        "<"
      );
    }
    if (!this.debug) {
      this.tl.to(
        this.road.pointsMaterial.uniforms.opacity,

        {
          duration: 10,
          value: 0,
        },
        "<"
      );
    }

    this.tl.to(
      this.textGod.opacity,
      {
        value: 1,
        duration: 1,
      },
      "<"
    );

    this.tl.to(
      this.camera.rotation,
      {
        x: 0,
        delay: steps.six - steps.five,
        duration: 60,
      },
      "<"
    );

    this.audio.addEventListener("timeupdate", (event) => {
      const progress = this.audio.currentTime;
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
  }

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

      const textMaterial = new THREE.MeshBasicMaterial({ opacity: 1, color: 0xff00ff, transparent: true });

      this.materialsText.push(textMaterial);

      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

      textMesh.position.x = options.x;
      textMesh.position.y = 2 + options.y;
      textMesh.position.z = options.z + 10;
      textMesh.scale.set(4, 4, 4);

      this.textsMesh.push(textMesh);

      const geometryButton = new THREE.BoxBufferGeometry(8, 1, 2);
      const materialButton = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          opacity: { value: 1 },
          uColor: { value: new THREE.Color("#BC2019") },
          changeColor: { value: 0 },
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
    if (this.buttonsMesh.length > 0) {
      const screenPosition = this.buttonsMesh[0].position.clone();
      screenPosition.project(this.camera);
      const translateX = screenPosition.x * this.sizes.width * 1600;
      const translateY = screenPosition.y * this.sizes.height * 9;
      this.btnPlay.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
    }
  }
}
