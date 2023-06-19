import * as THREE from "three";

export default class WebGLHelper {
  constructor(canvas) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.canvas = canvas;
    // レンダラーの設定
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
    });
    this.renderer.setSize(width, height);

    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    // カメラの設定
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 5000);
    this.camera.position.set(0, 0, 5);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
  }

  onResize() {
    // サイズを取得
    const width = window.innerWidth;
    const height = window.innerHeight;

    // レンダラーのサイズを調整する
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);

    // カメラのアスペクト比を正す
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  animate() {
    this.renderer.render(this.scene, this.camera);
  }
}
