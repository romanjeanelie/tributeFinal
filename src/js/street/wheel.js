import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

import vertex from "../shaders/wheel/seats/vertex";
import fragment from "../shaders/wheel/seats/fragment";

import vertex2 from "../shaders/wheel/branches/vertex2";
import fragment2 from "../shaders/wheel/branches/fragment2";
import vertex3 from "../shaders/wheel/branches/vertex3";
import fragment3 from "../shaders/wheel/branches/fragment3";

import vertex4 from "../shaders/wheel/base/vertex";
import fragment4 from "../shaders/wheel/base/fragment";

export default class Wheel {
  constructor(options) {
    this.scene = options.scene;

    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();

    this.mainWheel = new THREE.Group();
    this.baseWheel = new THREE.Group();

    this.wheel = new THREE.Group();
  }

  init() {
    this.addMainWheel();
    this.addBaseWheel();
    this.createBranch();
    this.createCircle();
    this.createLightBase();

    this.mainWheel.position.y = 13;

    this.wheel.add(this.baseWheel);
    this.wheel.add(this.mainWheel);

    this.wheel.position.x = 100;
    this.wheel.position.y = 0;
    this.wheel.position.z = 10;

    this.wheel.rotation.y = -Math.PI * 0.3;

    this.wheel.scale.set(1, 1, 1);
    this.scene.add(this.wheel);
  }

  addMainWheel() {
    this.seatPositions = [];

    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 1, transparent: true });

    this.gltfLoader.load("/models/mainWheel.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.name.includes("Seat")) {
          this.seatPositions.push(child.position);
        } else {
          // child.material = material;
        }
      });

      gltf.scene.position.x = -0.17;
      gltf.scene.position.y = -14.6;

      this.mainWheel.add(gltf.scene);

      this.createLightWheel(this.seatPositions);
    });
  }

  addBaseWheel() {
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
      depthWrite: false,
      transparent: true,
      //depthWrite: false,
    });
    this.gltfLoader.load("/models/baseWheel.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        // child.material = material;
      });
      // this.baseWheel.add(gltf.scene);
    });
  }

  createLightBase() {
    const nbFaces = 7;
    const faceA = new THREE.Group();
    const faceB = new THREE.Group();

    const faceGeometry = new THREE.PlaneBufferGeometry(1.5, 4);
    const faceMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor1: { value: new THREE.Color("#E77F68") },
        uColor2: { value: new THREE.Color("#FFFFFF") },
      },
      vertexShader: vertex4,
      fragmentShader: fragment4,
      transparent: true,
    });

    for (let i = 0; i < nbFaces; i++) {
      const face = new THREE.Mesh(faceGeometry, faceMaterial);

      face.position.y = i * 5;

      faceA.add(face);
    }

    for (let i = 0; i < nbFaces; i++) {
      const face = new THREE.Mesh(faceGeometry, faceMaterial);

      face.position.y = i * 5;

      faceB.add(face);
    }

    faceA.scale.set(0.4, 0.4, 0.4);

    faceA.position.x = -8;
    faceA.position.y = 3;
    faceA.position.z = 4.7;

    faceA.rotation.x = -0.2;
    faceA.rotation.z = -0.6;

    faceB.scale.set(0.4, 0.4, 0.4);

    faceB.position.x = 8;
    faceB.position.y = 3;
    faceB.position.z = 4.7;

    faceB.rotation.x = -0.2;
    faceB.rotation.z = 0.6;

    this.baseWheel.add(faceA, faceB);
  }

  createCircle() {
    const curve = new THREE.EllipseCurve(
      0,
      0, // ax, aY
      10,
      10, // xRadius, yRadius
      0,
      2 * Math.PI, // aStartAngle, aEndAngle
      false, // aClockwise
      0 // aRotation
    );
    const points = curve.getPoints(200);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // const material = new THREE.PointsMaterial({
    //   color: new THREE.Color("#B7299F"),
    //   size: 10,
    //   sizeAttenuation: true,
    //   transparent: true,
    //   opacity: 1,
    // });

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        color1: { value: new THREE.Color("#FFDE8F") },
        color2: { value: new THREE.Color("#ffffff") },
        opacity: { value: 1 },
      },
      vertexShader: vertex3,
      fragmentShader: fragment3,
      transparent: true,
      depthWrite: false,
    });
    const circle = new THREE.Points(geometry, material);

    this.mainWheel.add(circle);
  }

  createBranch() {
    // Branches
    const nbPointsBranch = 30;
    const nbBranches = 6;
    const ratioRotate = Math.PI / nbBranches;

    // const nbPointsBranch = 100;
    // const nbBranches = 110;
    this.branchGeometry = new THREE.PlaneGeometry(21, 0.1, nbPointsBranch, nbPointsBranch);

    this.branchMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor1: { value: new THREE.Color("#E77F68") },
        uColor2: { value: new THREE.Color("#0917FC") },
      },
      vertexShader: vertex2,
      fragmentShader: fragment2,
      transparent: true,
    });

    for (let i = 0; i < nbBranches; i++) {
      const branch = new THREE.Points(this.branchGeometry, this.branchMaterial);

      branch.position.x = 0;
      branch.rotation.z = (i + 1) * ratioRotate;
      // branch.rotation.z = i;

      this.mainWheel.add(branch);
    }
  }

  createLightWheel(positionsWindow) {
    const count = positionsWindow.length;
    this.pointsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        opacity: { value: 1 },
        uColor: { value: new THREE.Color("#261017") },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      // depthWrite: false,
    });

    const pointsGeometry = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const opacity = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 0] = positionsWindow[i].x;
      positions[i3 + 1] = positionsWindow[i].y - 15.6;
      positions[i3 + 2] = positionsWindow[i].z - 0.5;

      size[i] = 20000;
      opacity[i] = Math.random() * 0.6;
    }

    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute("size", new THREE.BufferAttribute(size, 1));
    pointsGeometry.setAttribute("opacity", new THREE.BufferAttribute(opacity, 1));

    const points = new THREE.Points(pointsGeometry, this.pointsMaterial);
    // this.mainWheel.add(points);
  }

  anim(progress, time) {
    this.mainWheel.rotation.z = time * 0.05;
  }
}
