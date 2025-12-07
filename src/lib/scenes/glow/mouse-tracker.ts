import type GUI from "lil-gui";

type OnChange = {
  x: number;
  y: number;
  xDelta: number;
  yDelta: number;
};
export class MouseTracker {
  locked = false;
  deltaLocked = false;
  prevData = [0, 0];

  // Options
  interval?: ReturnType<typeof setTimeout>;
  threshold = 300;
  window = 300;

  xCenter = window.innerWidth / 2;
  yCenter = window.innerHeight / 2;

  onForce: (args: OnChange) => void;

  handleResize() {
    this.xCenter = window.innerWidth / 2;
    this.yCenter = window.innerHeight / 2;
  }

  constructor({
    onForce,
    threshold,
    window,
    gui
  }: {
    onForce: (args: OnChange) => void;
    threshold: number;
    window: number;
    gui: GUI;
  }) {
    this.onForce = onForce;
    this.threshold = threshold;
    this.window = window;

    this.trackMouse();
    this.trackResize();
    this.initGui(gui);
  }

  initGui(gui: GUI) {
    const folder = gui.addFolder("Mouse Tracker");
    folder.add(this, "threshold").min(0).max(1000).step(1);
    folder.add(this, "window").min(0).max(3000).step(1);
  }

  private handleMouseMove(event: MouseEvent) {
    const diffX = event.clientX - this.xCenter;
    const diffY = event.clientY - this.yCenter;

    const x = diffX / this.xCenter;
    const y = diffY / this.yCenter;

    if (!this.locked) {
      this.locked = true;
      this.prevData = [x, y];
      this.interval = setTimeout(() => {
        this.locked = false;
      }, this.window);

      return;
    }

    const xDelta = Math.abs(x - this.prevData[0]);
    const yDelta = Math.abs(y - this.prevData[1]);

    if ((xDelta > 0.5 || yDelta > 0.5) && !this.deltaLocked) {
      this.prevData = [x, y];
      this.deltaLocked = true;

      setTimeout(() => {
        this.deltaLocked = false;
      }, 4000);
    }

    this.onForce({
      x,
      y,
      xDelta,
      yDelta
    });
  }

  private trackMouse() {
    window.addEventListener(
      "mousemove",
      this.handleMouseMove.bind(this)
    );
  }

  private trackResize() {
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  destroy() {
    if (this.interval) {
      clearTimeout(this.interval);
    }
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("resize", this.handleResize);
  }
}
