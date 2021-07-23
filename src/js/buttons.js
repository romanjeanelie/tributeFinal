import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

import ios from "./utils/ios";

import fragment from "./shaders/button/fragment.glsl";
import vertex from "./shaders/button/vertex.glsl";

export default class Buttons {
  constructor(options) {
    this.gui = options.gui;
    this.debugObject = {};

    this.loadingManager = options.loadingManager;
    this.loader = new THREE.FontLoader(this.loadingManager);

    this.sizes = options.sizes;
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
    this.plane = options.plane;
    this.planet = options.planet;
    this.help = options.help;

    this.finalScene = options.finalScene;

    this.btnPlay = document.querySelector(".play");

    this.buttonsMesh = [];
    this.buttons = new THREE.Group();
    this.textsMesh = [];
    this.materialsText = [];

    this.nbBtnClicked = 0;

    this.destroy = false;

    this.clicked = false;

    this.tl = gsap.timeline({ paused: true });
    this.audio = document.getElementById("audio");

    gsap.registerPlugin(SplitText);

    //////////////////////////////////////////////////// DEBUG
    this.debug = false;
    this.start = 30;
    //////////////////////////////////////////////////// DEBUG
  }

  init() {
    this.createButton({ text: "PLAY", x: 0, y: 0, z: 0 });

    this.buttons.position.y = -985;
    this.buttons.position.z = 19400;

    this.buttons.scale.set(1.7, 1.7, 1.7);

    this.objectsToTest = this.buttonsMesh;

    this.finalScene.add(this.buttons);

    this.hoverLinks();

    if (this.debug) {
      setTimeout(() => {
        this.returnScene();
      }, 1000);
    }

    this.cityLights = this.road.cityLights;
  }

  clickListener(obj) {
    this.btnPlay.addEventListener("click", () => {
      // Help
      this.clicked = true;
      this.help.hidePlay();
      //

      this.nbBtnClicked += 1;
      const btnClicked = this.buttonsMesh[0];
      const textClicked = this.textsMesh[0];
      const materialBtnClicked = this.materialButton;
      const materialTextClicked = this.textMaterial;

      gsap.to(btnClicked.position, {
        z: -10,
        duration: 0.5,
      });
      gsap.to(textClicked.position, {
        z: 10,
        duration: 0.5,
      });

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
      this.textGod.opacity.value = 1;
      start = this.start;
      this.tl.paused = true;
      this.audio.pause();
      setTimeout(() => {}, 500);
    }

    const steps = {};
    steps.one = 15;
    steps.two = 20;
    steps.three = 35;
    steps.four = 57;
    steps.five = 86;
    steps.six = 112;
    steps.seven = 163;

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
      this.plane,
      {
        textOpacity: 0,
        duration: 20,
      },
      "<"
    );

    this.tl.to(
      this.camera.position,
      {
        z: -28500,
        duration: 226,
        ease: "power1.inOut",
      },
      "<"
    );

    this.tl.to(
      this.flower.particlesMaterial.uniforms.scaleSize,
      {
        value: 1.5,
        duration: 7,
        ease: "power1.inOut",
      },
      "<"
    );

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
        duration: 15,
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

    this.tl.to(
      this.cityLights.textLight,
      {
        duration: 18,
        opacity: 1,
        ease: "power1.in",
      },
      "<"
    );

    this.tl.to(
      this.camera.rotation,
      {
        y: -Math.PI,
        delay: steps.five - steps.four,
        duration: 110,
        onStart: () => {},
      },
      "<"
    );

    this.tl.to(
      this.flower.particlesMaterial.uniforms.disperse,
      {
        value: 0,
        duration: 107,
        ease: "power1.inOut",
      },
      "<"
    );

    this.tl.to(
      this.flower.particlesMaterial.uniforms.scaleSize,
      {
        value: 2.5,
        duration: 10,
      },
      "<"
    );

    this.tl.to(
      this.flower.particlesMaterial.uniforms.changeColor,
      {
        value: 0,
        duration: 30,
        ease: "power2.in",
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

    this.tl.to(
      this.cityLights.textLight,
      {
        duration: 140,
        disperse: 1,
      },
      "<"
    );

    this.tl.to(
      this.cityLights.textLight,
      {
        duration: 50,
        opacity: 0,
      },
      "<"
    );

    this.tl.to(
      this.road.pointsMaterial.uniforms.opacity,

      {
        duration: 10,
        value: 0,
      },
      "<"
    );

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

    this.tl.to(
      this.planet.planetMaterial.uniforms.wide,
      {
        value: 5.8,
        delay: steps.seven - steps.six,
        duration: 12,
        onStart: () => {
          console.log("start wide");
        },
      },
      "<"
    );

    const finalSplit = new SplitText(".final p", { type: "chars" });

    let index1 = Math.round(finalSplit.chars.length / 2);
    let index2 = Math.round(finalSplit.chars.length / 2);
    let charTitle = finalSplit.chars[index1];
    this.tlFinal = gsap.timeline({ paused: true, delay: 2 });

    this.tlFinal.fromTo(
      charTitle,
      {
        opacity: 0,
        color: "#F41B0C",
      },
      {
        opacity: 1,
        color: "#ccc",
        duration: 6,
        ease: "power1.in",
      }
    );

    for (let i = 0; i < finalSplit.chars.length; i++) {
      index1 += 1;
      if (finalSplit.chars[index1]) {
        let charTitle = finalSplit.chars[index1];
        this.tlFinal.fromTo(
          charTitle,
          { opacity: 0, color: "#F41B0C" },
          {
            delay: i * 0.002,
            opacity: 1,
            color: "#ccc",
            duration: 6,
            ease: "power1.in",
          },
          "<"
        );
      }
      index2 -= 1;
      if (finalSplit.chars[index2]) {
        let charTitle = finalSplit.chars[index2];
        this.tlFinal.fromTo(
          charTitle,
          { opacity: 0, color: "#F41B0C" },
          {
            delay: i * 0.002,
            opacity: 1,
            color: "#ccc",
            duration: 6,
            ease: "power1.in",
          },
          "<"
        );
      }
    }

    this.audio.addEventListener("timeupdate", (event) => {
      const progress = this.audio.currentTime;

      if (progress > 204.5) {
        document.querySelector(".final").style.display = "flex";
        this.tlFinal.play();

        while (this.finalScene.children.length > 0) {
          this.finalScene.remove(this.finalScene.children[0]);
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

      this.textMaterial = new THREE.MeshBasicMaterial({ opacity: 0.2, color: 0xcccccc, transparent: true });

      const textMesh = new THREE.Mesh(textGeometry, this.textMaterial);

      textMesh.position.x = options.x;
      textMesh.position.y = options.y + 2;
      textMesh.position.z = options.z + 15;
      textMesh.scale.set(6.5, 6.5, 6.5);

      this.textsMesh.push(textMesh);

      const geometryButton = new THREE.BoxBufferGeometry(8, 1, 2);
      this.materialButton = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          opacity: { value: 0.5 },
          uColor: { value: new THREE.Color("#B10026") },
          changeColor: { value: 0 },
        },
        transparent: true,
        vertexShader: vertex,
        fragmentShader: fragment,
      });

      const button = new THREE.Mesh(geometryButton, this.materialButton);

      button.rotation.x = Math.PI * 0.5;
      button.position.x = options.x;
      button.position.y = options.y;
      button.position.z = options.z;
      button.scale.set(18, 18, 18);

      this.buttonsMesh.push(button);

      this.buttons.add(button, textMesh);

      // All buttons are loaded
      if (this.buttons.children.length > 0) {
        this.objectsToTest.forEach((obj) => {
          this.clickListener(obj);
        });
      }
    });
  }

  display() {
    gsap.to(this.materialButton.uniforms.opacity, {
      value: 1,
    });
    gsap.to(this.textMaterial, {
      opacity: 1,
    });

    document.querySelector(".btn__wrapper .play").style.pointerEvents = "auto";

    // Help
    setTimeout(() => {
      if (this.clicked === false) {
        this.help.displayPlay();
      } else {
        return;
      }
    }, 5000);
  }

  hoverLinks() {
    const linkRoman = document.querySelector(".link__roman");
    const linkBeau = document.querySelector(".link__beau");
    const finalSpans = document.querySelectorAll(".final span");

    linkBeau.addEventListener("mouseenter", () => {
      finalSpans.forEach((span) => {
        span.classList.add("inactive");
      });
      linkRoman.classList.add("inactive");
    });
    linkBeau.addEventListener("mouseleave", () => {
      finalSpans.forEach((span) => {
        span.classList.remove("inactive");
        linkRoman.classList.remove("inactive");
      });
    });

    linkRoman.addEventListener("mouseenter", () => {
      finalSpans.forEach((span) => {
        span.classList.add("inactive");
      });
      linkBeau.classList.add("inactive");
    });
    linkRoman.addEventListener("mouseleave", () => {
      finalSpans.forEach((span) => {
        span.classList.remove("inactive");
        linkBeau.classList.remove("inactive");
      });
    });
  }

  anim(progress, time) {
    if (this.materialButton) {
      this.materialButton.uniforms.time.value = time;
    }
    this.tl.seek(this.audio.currentTime);
    if (this.buttonsMesh.length > 0) {
      const screenPosition = this.buttonsMesh[0].position.clone();
      screenPosition.project(this.camera);
      const translateX = screenPosition.x * this.sizes.width * 1600;
      const translateY = screenPosition.y * this.sizes.height * 9;
      this.btnPlay.style.transform = `translateX(${translateX}px) translateY(${translateY + 42}px)`;
    }
    if (this.debug) {
      this.sky.opacity = 0;
    }
  }
}
