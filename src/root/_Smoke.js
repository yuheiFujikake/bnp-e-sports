import * as THREE from "three";
import SMOKE_IMAGE from "Images/smokeElement.png";

export default class SmokeWebGL {
  constructor(renderer, scene, clock) {
    this.renderer = renderer;
    this.scene = scene;
    this.clock = clock;
    this.particles = [];
  }

  init() {
    const geometry = new THREE.PlaneGeometry(30, 30);
    new THREE.TextureLoader().load(SMOKE_IMAGE, (texture) => {
      const material = new THREE.MeshLambertMaterial({
        color: 0x565565,
        map: texture,
        transparent: true,
        depthTest: false,
      });

      for (let i = 0; i < 7; i++) {
        const particle = new THREE.Mesh(geometry, material);
        particle.position.x = Math.random() * 30 - 15;
        particle.position.y = Math.random() * 1 - 8;
        particle.position.z = Math.random() * 6 - 10;
        particle.rotation.z = Math.random() * 360;

        this.particles.push(particle);

        this.scene.add(particle);
      }
    });
  }

  animate() {
    const delta = this.clock.getDelta();
    let num = this.particles?.length ?? 0;
    while (num--) {
      this.particles[num].rotation.z += delta * 0.03;
    }
  }
}
