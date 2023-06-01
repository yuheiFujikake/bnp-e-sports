import * as THREE from "three";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/addons/renderers/CSS3DRenderer.js";
import SMOKE_TEXTURE from "Images/webgl/Smoke-Element.png";

window.addEventListener("load", () => {
  new Smoke();
});

class Smoke {
  static FOV = 75;
  static MAX_DISTANCE = 1000;
  static MIN_DISTANCE = -150;
  static SMOKE_COUMT = 250;
  constructor() {
    this.clock;
    this.camera;
    this.scroll = Smoke.MAX_DISTANCE;
    this.cameraPosiZ = Smoke.MAX_DISTANCE;
    this.before = 0;
    this.delta;
    this.smokeParticles = [];
    this.initThree();
    this.initObject();
    this.initEvent();

    this.render();
    this.onResize();
  }

  /**
   * Three.jsの初期化処理を行う.
   */
  initThree() {
    // 開始時間を記録
    this.clock = new THREE.Clock();
    // 表示領域を作成
    this.renderer = new CSS3DRenderer();
    document.body.appendChild(this.renderer.domElement);

    // シーンの作成
    this.scene = new THREE.Scene();
    // カメラの作成
    this.camera = new THREE.PerspectiveCamera(
      Smoke.FOV,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = this.cameraPosiZ;
    this.scene.add(this.camera);

    // 光源の追加
    let light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(-1, 0, 1);
    this.scene.add(light);
  }

  /**
   * Objectの初期化処理を行う.
   */
  initObject() {
    this.__createSmoke();
  }
  /**
   * イベント系初期化処理を行う.
   */
  initEvent() {
    window.addEventListener("resize", () => {
      this.onResize();
    });
    window.onmousewheel = (event) => {
      this.scroll = event.wheelDelta / 3;
      this.scroll += this.cameraPosiZ;
    };

    window.ontouchstart = (event) => {
      this.prevTouchPosY = event.touches[0].pageY;
    };

    window.ontouchmove = (event) => {
      this.currentTouchPosY = event.touches[0].pageY;
      this.offset = this.prevTouchPosY - this.currentTouchPosY;
      this.prevTouchPosY = this.currentTouchPosY;
      this.scroll = this.offset * 5;
      this.scroll += this.cameraPosiZ;
    };
  }

  __createSmoke() {
    const image = document.createElement("img");
    image.addEventListener("load", () => {
      for (let i = 0; i < Smoke.SMOKE_COUMT; i++) {
        const object = new CSS3DObject(image.cloneNode());
        object.position.x = Math.random() * 500 - 250;
        object.position.y = Math.random() * 500 - 250;
        object.position.z = Math.random() * 1000 - 100;
        this.scene.add(object);
        this.smokeParticles.push(object);
      }
    });
    image.src = SMOKE_TEXTURE;
  }

  __smokeTransition() {
    this.smokeParticles.forEach((particle) => {
      particle.rotation.z += this.delta * 0.06;
    });
  }

  __controlDistance() {
    let isMoreSmall = Smoke.MAX_DISTANCE >= this.scroll;
    let isMoreGig = this.scroll >= Smoke.MIN_DISTANCE;
    if (isMoreSmall && isMoreGig) {
      this.cameraPosiZ += (this.scroll - this.cameraPosiZ) * 0.08;
      this.camera.position.z = this.cameraPosiZ;
    }
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });
    this.delta = this.clock.getDelta();
    this.__controlDistance();
    this.__smokeTransition();
    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setSize(width, height);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
