import * as THREE from "three";
import {
  EffectComposer,
  OrbitControls,
  RenderPass,
  ShaderPass
} from "three/examples/jsm/Addons.js";
import { SwirlPass } from "./swirlPass.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { loadTexture, randomInRange } from "./utils";
import GUI from "lil-gui";
import { Ripple } from "./ripple.js";
import { createSceneFactory } from "../index.svelte.js";

class LiquillScene {
  scene = new THREE.Scene();
  composer!: EffectComposer;
  renderer = new THREE.WebGLRenderer();
  canvas!: HTMLCanvasElement;
  camera = new THREE.OrthographicCamera();

  width = window.innerWidth;
  height = window.innerHeight;

  brushScene = new THREE.Scene();
  brushTexture = new THREE.WebGLRenderTarget();

  stats = new Stats();
  controls = new OrbitControls(this.camera, this.canvas);

  state = {
    isEditing: false
  };

  settings: Record<string, any> = {
    scale: 1.76,
    smoothStepStart: 0.41,
    smoothStepEnd: 0.85,
    showWaves: false,
    showRipples: false,
    showGrain: false,
    firstStageProgress: 0,
    secondStageProgress: 0
  };
  mouse = new THREE.Vector2(0, 0);
  prevMouse = new THREE.Vector2(0, 0);

  gui = new GUI();

  init() {
    this.canvas = document.querySelector(
      "canvas.webgl"
    ) as HTMLCanvasElement;
    this.setSize();
    this.setupRenderer();
    this.setupCamera();
    this.setupResize();
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.trackMouse();
    this.addObjects();
    this.initPost();
    this.initSettings();
  }

  shaderPass!: ShaderPass;

  initSettings() {
    this.gui.add(this.settings, "firstStageProgress", 0, 1, 0.01);
    this.gui.add(this.settings, "secondStageProgress", 0, 1, 0.01);
    this.gui.add(this.settings, "scale", 0, 10, 0.01);
    this.gui.add(this.settings, "smoothStepStart", 0, 1, 0.01);
    this.gui.add(this.settings, "smoothStepEnd", 0, 1, 0.01);
    this.gui.add(this.settings, "showGrain");
    this.gui.add(this.settings, "showWaves");
    this.gui.add(this.settings, "showRipples");
    this.gui.hide();
  }

  toggleEditScene() {
    this.state.isEditing = !this.state.isEditing;
    if (this.state.isEditing) {
      this.gui.show();
    } else {
      this.gui.hide();
    }
  }

  updateUniformsFromSettings() {
    for (const key in this.settings) {
      this.shaderPass.uniforms[key].value = this.settings[key];
    }
  }

  initPost() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    this.shaderPass = new ShaderPass(SwirlPass);

    this.updateUniformsFromSettings();
    this.shaderPass.uniforms.delay.value = randomInRange(2, 4);
    this.shaderPass.uniforms.time.value = 0;
    this.shaderPass.uniforms.grainTexture = new THREE.Uniform(
      loadTexture("/assets/liquill/perlin1.png")
    );
    this.shaderPass.uniforms.displacement = new THREE.Uniform(null);

    this.composer.addPass(this.shaderPass);
  }

  setSize() {
    const parentRect =
      this.canvas.parentElement?.getBoundingClientRect();

    if (parentRect) {
      this.width = parentRect.width;
      this.height = parentRect.height;
    } else {
      this.width = window.innerWidth / 0.5;
      this.height = this.width;
    }
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.brushTexture = new THREE.WebGLRenderTarget(
      this.width,
      this.height,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      }
    );
  }

  setupCamera() {
    const frustrum = this.height;
    const aspect = this.width / this.height;
    this.camera = new THREE.OrthographicCamera(
      (frustrum * aspect) / -2,
      (frustrum * aspect) / 2,
      frustrum / 2,
      frustrum / -2,
      -1000,
      1000
    );
    this.camera.position.set(0, 0, 82);
    this.camera.lookAt(0, 0, 0);
  }

  setupResize() {
    window.addEventListener("resize", () => {
      // Update sizes
      this.setSize();

      // Update camera
      this.camera.updateProjectionMatrix();

      // Update renderer
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
      );
    });
  }

  trackMouse() {
    window.addEventListener("mousemove", (event) => {
      const { left, top, bottom } =
        this.canvas.getBoundingClientRect();
      const x =
        event.clientX > left ? event.clientX - left : event.clientX;
      const outsideY = event.clientY < top || event.clientY > bottom;
      this.mouse.x = x - this.width / 2;
      this.mouse.y = outsideY
        ? 0
        : this.height / 2 + top - event.clientY;
    });
  }

  addObjects() {
    this.addRipples();
  }

  ripples: Array<Ripple> = [];
  rippleCount = 60;
  currentRipple = 0;

  addRipples() {
    let texture = loadTexture("/assets/liquill/brush2.png");

    for (let index = 0; index < this.rippleCount; index++) {
      this.ripples.push(
        new Ripple({ texture, scene: this.brushScene })
      );
    }

    window.addEventListener(
      "mousemove",
      this.createRipple.bind(this)
    );
  }

  createRipple() {
    if (
      Math.abs(this.mouse.x - this.prevMouse.x) < 2 &&
      Math.abs(this.mouse.y - this.prevMouse.y) < 2
    ) {
      return;
    }

    this.ripples[this.currentRipple].place({
      x: this.mouse.x,
      y: this.mouse.y
    });

    this.currentRipple = (this.currentRipple + 1) % this.rippleCount;
    this.prevMouse.x = this.mouse.x;
    this.prevMouse.y = this.mouse.y;
  }

  updateRipples() {
    for (const ripple of this.ripples) {
      ripple.update();
    }
  }

  clock = new THREE.Clock();

  render() {
    const elapsedTime = this.clock.getElapsedTime();

    this.controls.update();

    this.updateRipples();

    // Create brush comp texture
    this.renderer.setRenderTarget(this.brushTexture);
    this.renderer.render(this.brushScene, this.camera);

    // Set shader uniforms
    this.updateUniformsFromSettings();
    this.shaderPass.uniforms.displacement.value =
      this.brushTexture.texture;
    this.shaderPass.uniforms.time.value = elapsedTime;

    // Render
    this.composer.render();

    window.requestAnimationFrame(this.render.bind(this));
  }

  destroy() {
    this.renderer.dispose();
    this.composer?.dispose();
    this.gui.destroy();
  }
}

const createScene = createSceneFactory(LiquillScene);

export { createScene };
