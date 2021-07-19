import * as THREE from "three";

import fragment from "../shaders/streetLight/fragment.glsl";
import vertex from "../shaders/streetLight/vertex.glsl";

export default class Garland {
  constructor(options) {
    this.scene = options.scene;

    this.lightsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        time: { value: 0 },
        move: { value: 0 },
        color1: { value: new THREE.Color("#FF00FF") },
        color2: { value: new THREE.Color("#ff0000") },
        opacity: { value: 1 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
    });

    this.lightsGarland = new THREE.Group();
    this.garlands = new THREE.Group();
  }

  init() {
    const nbGarlands = 10;

    for (let i = 0; i < nbGarlands; i++) {
      this.createGarland(i);
    }

    this.garlands.rotation.y = -1;
    this.garlands.position.x = 120;
    this.garlands.position.y = 13;

    this.scene.add(this.garlands);
  }
  createGarland(i) {
    const curve = new THREE.SplineCurve([
      new THREE.Vector3(-15, 0, Math.random() * i),
      new THREE.Vector3(0, -4, 0),
      new THREE.Vector3(15, 0, 0),
    ]);

    const points = curve.getPoints(20);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.PointsMaterial({
      color: new THREE.Color("#FFBF87"),
      size: 6,
      sizeAttenuation: true,
    });

    const garland = new THREE.Points(geometry, material);

    garland.position.z = Math.random() * i * 3;

    this.garlands.add(garland);
  }

  // addAllee() {
  //   this.pointsMaterial = new THREE.ShaderMaterial({
  //     uniforms: {
  //       uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
  //       time: { value: 0 },
  //       move: { value: 0 },
  //       color1: { value: new THREE.Color("#E77F68") },
  //       color2: { value: new THREE.Color("#FFB400") },
  //       opacity: { value: 1 },
  //     },
  //     vertexShader: vertex,
  //     fragmentShader: fragment,
  //     transparent: true,
  //     depthWrite: false,
  //   });

  //   // this.scene.add(alleeGlobal);

  //   const nbAllees = 10;

  //   for (let i = 0; i < nbAllees; i++) {
  //     this.createAllee(i);
  //   }
  // }

  // createAllee(index) {
  //   const allee1 = new THREE.Group();
  //   let allee2 = new THREE.Group();

  //   let alleeGlobal = new THREE.Group();

  //   const countLights = 60;

  //   const pointsGeometry = new THREE.BufferGeometry();

  //   const positions = new Float32Array(countLights * 3);
  //   const size = new Float32Array(countLights);
  //   const opacity = new Float32Array(countLights);

  //   for (let i = 0; i < countLights * 3; i++) {
  //     const i3 = i * 3;
  //     positions[i3 + 0] = i * Math.random();
  //     positions[i3 + 1] = 1;
  //     positions[i3 + 2] = 0;

  //     size[i] = 10000 + Math.random();
  //     opacity[i] = Math.random();
  //   }
  //   pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  //   pointsGeometry.setAttribute("size", new THREE.BufferAttribute(size, 1));
  //   pointsGeometry.setAttribute("opacity", new THREE.BufferAttribute(opacity, 1));

  //   const points = new THREE.Points(pointsGeometry, this.pointsMaterial);

  //   allee1.add(points);
  //   allee2 = allee1.clone();

  //   allee1.position.x = 100;
  //   allee1.rotation.y = 0.5;

  //   allee2.position.x = 102;
  //   allee2.rotation.y = 0.5;

  //   alleeGlobal.add(allee1, allee2);
  // }

  anim(progress, time) {
    this.mainWheel.rotation.z = time * 0.05;
  }
}
