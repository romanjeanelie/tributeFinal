import * as THREE from "three";

import fragment from "../shaders/streetLight/fragment.glsl";
import vertex from "../shaders/streetLight/vertex.glsl";

export default class Ride {
  constructor(options) {
    this.scene = options.scene;
  }

  init() {}
  createRide() {}

  anim(progress, time) {}
}
