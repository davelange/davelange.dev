import * as THREE from "three";
import { degToRad } from "three/src/math/MathUtils.js";

export type RippleMesh = THREE.Mesh<
  THREE.PlaneGeometry,
  THREE.MeshBasicMaterial
>;

const geometry = new THREE.PlaneGeometry(180, 180, 1, 1);

export class Ripple {
  material: THREE.MeshBasicMaterial;
  mesh: RippleMesh;

  constructor({
    texture,
    scene,
  }: {
    texture: THREE.Texture;
    scene: THREE.Scene;
  }) {
    this.material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.rotateX(degToRad(60));
    this.mesh.visible = false;

    scene.add(this.mesh);
  }

  place({ x, y }: { x: number; y: number }) {
    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.visible = true;
    this.mesh.material.opacity = 0.9;
    this.mesh.scale.setX(1);
    this.mesh.scale.setY(1);
  }

  update(intensity: number) {
    if (this.mesh.material.opacity < 0.001) {
      this.mesh.visible = false;
    } else {
      this.mesh.material.opacity *= 0.97;
      this.mesh.scale.x = this.mesh.scale.x * 0.982 + intensity;
      this.mesh.scale.y = this.mesh.scale.y * 0.982 + intensity;
    }
  }
}

export class RippleManager {
  ripples: Ripple[] = [];
  count = 0;
  currentRipple = 0;

  init({
    count,
    texture,
    scene,
  }: {
    count: number;
    texture: THREE.Texture;
    scene: THREE.Scene;
  }) {
    this.count = count;
    for (let i = 0; i < count; i++) {
      this.ripples.push(new Ripple({ texture, scene }));
    }
  }

  createRipple({
    mousePos,
    prevMousePos,
  }: {
    mousePos: THREE.Vector2;
    prevMousePos: THREE.Vector2;
  }) {
    if (
      Math.abs(mousePos.x - prevMousePos.x) < 8 &&
      Math.abs(mousePos.y - prevMousePos.y) < 8
    ) {
      return;
    }

    this.ripples[this.currentRipple].place({
      x: mousePos.x,
      y: mousePos.y,
    });

    this.currentRipple = (this.currentRipple + 1) % this.count;
  }

  update(intensity: number) {
    for (const ripple of this.ripples) {
      ripple.update(intensity);
    }
  }
}
