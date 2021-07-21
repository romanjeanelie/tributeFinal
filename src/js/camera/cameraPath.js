import * as THREE from "three";

import vertex from "../shaders/screen/vertex.glsl";
import fragment from "../shaders/screen/fragment.glsl";

export default class cameraPath {
  constructor(options) {
    this.camera = options.camera;
    this.scene = options.scene;
    this.renderer = options.renderer;
    this.container = options.container;
    this.sizes = options.sizes;
    this.gui = options.gui;
    this.splineCamera = null;
    this.cameraHelper = null;

    this.direction = new THREE.Vector3();
    this.binormal = new THREE.Vector3();
    this.normal = new THREE.Vector3();
    this.position = new THREE.Vector3();

    this.tubeGeometry = null;
    this.mesh = null;

    this.params = {
      extrusionSegments: 100,
      radiusSegments: 3,
      animationView: true,
      lookAhead: false,
      cameraHelper: false,
    };

    this.progress = 0;

    // ACTIVE CAMERA /////////////////
    this.isActive = false;
    window.camera = this.camera;
    // ACTIVE CAMERA /////////////////

    this.positionCameraLarge();
    this.init();
  }

  positionCameraLarge() {
    if (this.isActive) {
      this.camera.position.x = 1004.4;
      this.camera.position.y = -6584.3;
      this.camera.position.z = 8906.94;

      // this.camera.position.x = 0;
      // this.camera.position.y = 1;
      // this.camera.position.z = 15;

      this.posCameraLarge = new THREE.Vector3(500, -4500, 0);
      // this.posCameraLarge = new THREE.Vector3(0, 0, 0);

      this.params.animationView = false;
      document.body.classList.remove("scroll");
      document.querySelector(".btn__wrapper").style.pointerEvents = "none";
    } else {
      document.body.classList.add("scroll");
      document.querySelector(".btn__wrapper").style.pointerEvents = "auto";
    }
  }

  addTube(curve) {
    if (this.mesh) {
      this.scene.remove(this.mesh);
    }
    this.splines = {
      spline: new THREE.CatmullRomCurve3(curve),
    };

    this.extrudePath = this.splines.spline;

    this.material = new THREE.LineBasicMaterial({ color: 0xff00ff });

    this.tubeGeometry = new THREE.TubeGeometry(
      this.extrudePath,
      this.params.extrusionSegments,
      0.2,
      this.params.radiusSegments
    );
    this.mesh = new THREE.Mesh(this.tubeGeometry, this.material);

    // HIDE TUBE //////////////////////////////////////
    this.mesh.visible = false;

    this.scene.add(this.mesh);
  }

  animateCamera() {
    // Toggle Tube
    this.mesh.visible = !this.mesh.visible;
  }

  toggleCameraHelper() {
    this.cameraHelper.visible = !this.params.cameraHelper;
  }

  addScreen(ratio) {
    this.screenGeometry = new THREE.PlaneBufferGeometry(0.1, 2);
    this.screenMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        thickFactor: { value: 1 },
        progress: { value: 0 },
        opacity: { value: 1 },
        wide: { value: 0 },
        uColor: { value: new THREE.Color("#ffffff") },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
    });

    this.screen = new THREE.Mesh(this.screenGeometry, this.screenMaterial);
    this.screen.position.z = -1;

    this.cameraAndScreen.add(this.screen);

    this.screenGeometry.center();
  }

  resize(width, height) {
    this.sizes.width = width;
    this.sizes.height = height;
    const ratio = this.sizes.width / this.sizes.height;
    this.splineCamera.aspect = ratio;
    this.splineCamera.updateProjectionMatrix();

    const widthScreen = Math.tan(70 / 2) / Math.abs(this.screen.position.z);
    this.screen.scale.x = ratio * 14;
  }

  init() {
    // Camera
    this.cameraAndScreen = new THREE.Group();

    this.addScreen();

    this.splineCamera = new THREE.PerspectiveCamera(70, this.sizes.width / this.sizes.height, 0.01, 115000);

    var vector = new THREE.Vector3(); // create once and reuse it!

    this.cameraAndScreen.add(this.splineCamera);

    this.scene.add(this.cameraAndScreen);

    this.cameraHelper = new THREE.CameraHelper(this.splineCamera);
    this.scene.add(this.cameraHelper);
    this.cameraHelper.visible = this.params.cameraHelper;

    // GUI
    this.folderCamera = this.gui.addFolder("Camera");
    this.folderCamera.add(this.params, "animationView").onChange(() => {
      this.isActive = !this.isActive;
      this.positionCameraLarge();
      console.log(this.isActive);
    });
    this.folderCamera.add(this.params, "cameraHelper").onChange(() => {
      this.toggleCameraHelper();
    });
    this.folderCamera.open();
  }

  cameraPath(progress) {
    this.looptime = 20 * 1000;

    // range number between 0 and 1
    this.t = (progress % this.looptime) / this.looptime;
    this.t2 = ((progress + 0.1) % this.looptime) / this.looptime;

    this.pos = this.mesh.geometry.parameters.path.getPointAt(this.t);
    this.pos2 = this.mesh.geometry.parameters.path.getPointAt(this.t2);

    this.cameraAndScreen.position.copy(this.pos2);

    this.cameraHelper.update();
  }

  anim(progress, time) {
    // animate camera along spline
    this.camera.updateProjectionMatrix();

    this.cameraPath(this.progress);
    if (this.isActive) {
      this.camera.lookAt(this.posCameraLarge);
    }

    this.renderer.render(this.scene, this.params.animationView === true ? this.splineCamera : this.camera);

    // Update screen
    this.screenMaterial.uniforms.time.value = time;
    this.screenMaterial.uniforms.progress.value = progress;
  }
}

//
