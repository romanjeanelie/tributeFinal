import * as THREE from "three";

export default class cameraPath {
  constructor(options) {
    this.camera = options.camera;
    this.scene = options.scene;
    this.renderer = options.renderer;
    this.container = options.container;
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

    //this.positionCameraLarge();
    this.init();
  }

  positionCameraLarge() {
    this.camera.position.x = -690;
    this.camera.position.y = -3880;
    // this.camera.position.z = 2320;
    this.camera.position.z = 2120;
    this.posCameraLarge = new THREE.Vector3(210, -3000, -2369.896873902935);
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

  init() {
    // Camera
    this.splineCamera = new THREE.PerspectiveCamera(
      70,
      this.container.offsetWidth / this.container.offsetHeight,
      0.01,
      7000
    );

    var vector = new THREE.Vector3(); // create once and reuse it!

    this.scene.add(this.splineCamera);

    this.cameraHelper = new THREE.CameraHelper(this.splineCamera);
    this.scene.add(this.cameraHelper);
    this.cameraHelper.visible = this.params.cameraHelper;

    // GUI
    this.folderCamera = this.gui.addFolder("Camera");
    this.folderCamera.add(this.params, "animationView").onChange(() => {
      this.animateCamera();
      document.body.classList.toggle("scroll");
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

    this.splineCamera.position.copy(this.pos2);

    this.cameraHelper.update();
  }

  anim(progress) {
    // animate camera along spline
    this.camera.updateProjectionMatrix();

    this.cameraPath(this.progress);
    // this.camera.lookAt(this.posCameraLarge);

    this.renderer.render(this.scene, this.params.animationView === true ? this.splineCamera : this.camera);
  }
}

//
