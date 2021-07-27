import * as THREE from "three";

export default class StructureText {
  constructor(options) {
    this.scene = options.scene;

    this.positions = options.positions;
    this.scale = options.scale;
    this.rotationY = options.rotateY;

    this.structure = new THREE.Group();
    this.init();
  }

  init() {
    this.addBars();

    this.structure.position.x = this.positions.x;
    this.structure.position.y = this.positions.y;
    this.structure.position.z = this.positions.z;

    this.structure.scale.set(this.scale, this.scale, this.scale);

    this.structure.rotation.y = this.rotationY;
    this.scene.add(this.structure);
  }

  addBars() {
    this.barMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xff0000),
    });

    this.addBarsVertical();
    this.addBarsHorizontal();
  }

  addBarsVertical() {
    let posX = -1.2;

    const height = 2;
    const posY = -0.5;
    const posZ = -0.1;
    const rotZ = 0;

    const barsVertical = 6;

    for (let i = 0; i < barsVertical; i++) {
      this.createBars(height, posX, posY, posZ, rotZ);
      posX += 0.5;
    }
  }

  addBarsHorizontal() {
    const height = 3.4;
    const posX = 0;
    let posY = -0.25;
    const posZ = -0.1;
    const rotZ = Math.PI * 0.5;

    const barsVertical = 4;

    for (let i = 0; i < barsVertical; i++) {
      this.createBars(height, posX, posY, posZ, rotZ);
      posY += 0.17;
    }
  }

  createBars(height, posX, posY, posZ, rotZ) {
    this.barGeometry = new THREE.CylinderBufferGeometry(0.01, 0.01, height, 3);

    this.bar = new THREE.Mesh(this.barGeometry, this.barMaterial);

    this.bar.position.x = posX;
    this.bar.position.y = posY;
    this.bar.position.z = posZ;

    this.bar.rotation.z = rotZ;

    this.structure.add(this.bar);
  }
}
