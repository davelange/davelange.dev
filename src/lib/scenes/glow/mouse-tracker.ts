import type GUI from "lil-gui";
import * as THREE from "three";
import { degToRad } from "three/src/math/MathUtils.js";

export class MouseTracker {
  position = new THREE.Vector2(0, 0);

  interval?: ReturnType<typeof setTimeout>;
  isPolling = false;

  threshold = 300;
  window = 300;
  forceFactor = 0.8;

  onForce: (x: number, y: number) => void;

  constructor({
    onForce,
    threshold,
    window,
    forceFactor,
    gui
  }: {
    onForce: (x: number, y: number) => void;
    threshold: number;
    window: number;
    forceFactor: number;
    gui: GUI;
  }) {
    this.onForce = onForce;
    this.trackMouse();
    this.threshold = threshold;
    this.window = window;
    this.forceFactor = forceFactor;

    this.initGui(gui);
  }

  initGui(gui: GUI) {
    const folder = gui.addFolder("Mouse Tracker");
    folder.add(this, "threshold").min(0).max(1000).step(1);
    folder.add(this, "window").min(0).max(3000).step(1);
    folder.add(this, "forceFactor").min(-1).max(10).step(0.01);
  }

  private handleMouseMove(event: MouseEvent) {
    if (!this.isPolling) {
      this.isPolling = true;
      this.position.x = event.clientX;
      this.position.y = event.clientY;

      this.interval = setTimeout(() => {
        this.isPolling = false;
      }, this.window);

      return;
    }

    const diffX = event.clientX - this.position.x;
    const diffY = event.clientY - this.position.y;

    if (
      Math.abs(diffX) > this.threshold ||
      Math.abs(diffY) > this.threshold
    ) {
      const toRotation = (val: number) =>
        degToRad(val * this.forceFactor);

      this.onForce(toRotation(diffX), toRotation(diffY));

      clearTimeout(this.interval);

      this.isPolling = false;
    }
  }

  private trackMouse() {
    window.addEventListener(
      "mousemove",
      this.handleMouseMove.bind(this)
    );
  }

  destroy() {
    if (this.interval) {
      clearTimeout(this.interval);
    }
    window.removeEventListener("mousemove", this.handleMouseMove);
  }
}
