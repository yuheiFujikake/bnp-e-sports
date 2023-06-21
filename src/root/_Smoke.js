import * as THREE from "three";
import SMOKE_IMAGE from "Images/smokeElement.png";

export default class SmokeWebGL {
  constructor(renderer, scene, clock) {
    this.renderer = renderer;
    this.scene = scene;
    this.clock = clock;
    this.particles = [];
    this.omenParticles = [];
  }

  init() {
    const geometry = new THREE.PlaneGeometry(30, 30);
    new THREE.TextureLoader().load(SMOKE_IMAGE, (texture) => {
      const omen = new THREE.MeshLambertMaterial({
        color: 0x6a5acd,
        map: texture,
        transparent: true,
        depthTest: false,
      });
      for (let i = 1; i <= 3; i++) {
        const particle = new THREE.Mesh(geometry, omen);
        particle.position.x = i * -7 - 3;
        particle.position.y = -10;
        particle.position.z = -30;
        particle.rotation.z = Math.random() * 360;
        this.omenParticles.push(particle);
        this.scene.add(particle);
      }
      const center = new THREE.MeshLambertMaterial({
        color: 0x565565,
        map: texture,
        transparent: true,
        depthTest: false,
      });

      for (let i = 1; i <= 2; i++) {
        const particle = new THREE.Mesh(geometry, center);
        particle.position.x = 0;
        particle.position.y = -10;
        particle.position.z = -20;
        particle.rotation.z = Math.random() * 360;
        if (i % 2 == 0) {
          this.omenParticles.push(particle);
        } else {
          this.particles.push(particle);
        }
        this.scene.add(particle);
      }
      const viper = new THREE.MeshLambertMaterial({
        color: 0x00ff00,
        map: texture,
        transparent: true,
        depthTest: false,
      });
      for (let i = 1; i <= 3; i++) {
        const particle = new THREE.Mesh(geometry, viper);
        particle.position.x = i * 7 + 3;
        particle.position.y = -11;
        particle.position.z = -30;
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
      this.particles[num].rotation.z += delta * 0.1;
    }
    let con = this.omenParticles?.length ?? 0;
    while (con--) {
      this.omenParticles[con].rotation.z -= delta * 0.1;
    }
  }
}
