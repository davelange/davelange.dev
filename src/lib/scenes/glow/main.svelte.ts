import * as THREE from "three";
import {
  EffectComposer,
  ShaderPass
} from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";
//import { loadTexture, rand, wait } from "./utils";
//import { colorsDark, colorsLight, lakeConfigs, text } from "./config";
//import { RippleManager } from "./ripple";
import { GlowPass } from "./glow-pass";
import { Tween } from "svelte/motion";
import { cubicOut, expoInOut } from "svelte/easing";
import { themeManager } from "$lib/theme.svelte";
import { createPubSub } from "$lib/pub";
import { GlowPlane } from "./glow-plane";
import vertex from "./glow-plane-vertex.glsl?raw";
import fragment from "./glow-plane-fragment.glsl?raw";

let post = false;

export class GlowScene {
  scene = new THREE.Scene();
  composer!: EffectComposer;
  shaderPass!: ShaderPass;
  renderer = new THREE.WebGLRenderer();
  canvas: HTMLCanvasElement;
  camera = new THREE.OrthographicCamera();
  clock = new THREE.Clock();

  width = 0;
  height = 0;

  state = {
    enabled: true,
    isFirstRun: true,
    isEditing: false
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  settings: Record<string, any> = {
    shader: {
      waveScale: 1.4,
      stepLo: 0.13,
      stepHi: 0.68
    }
  };
  gui = new GUI();

  preScene = new THREE.Scene();
  preTexture = new THREE.WebGLRenderTarget();

  mouse = new THREE.Vector2(0, 0);
  prevMouse = new THREE.Vector2(0, 0);

  constructor() {
    this.canvas = document.querySelector(
      "canvas.webgl"
    ) as HTMLCanvasElement;

    this.setSize();
    this.setupRenderer();
    this.setupCamera();
    this.setupResize();
    this.trackMouse();
    this.addObjects();
    if (post) this.initPost();
    this.setupEvents();
    this.initSettings();

    //this.pubs.publish("phase", this.state.phase);
  }

  setupEvents() {}

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.preTexture = new THREE.WebGLRenderTarget(
      this.width,
      this.height,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        colorSpace: THREE.LinearSRGBColorSpace,
        samples: 12
      }
    );
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

  initSettings() {
    const shaderFolder = this.gui.addFolder("Shader");
    shaderFolder.add(this.settings.shader, "waveScale", 0, 10, 0.01);
    shaderFolder.add(this.settings.shader, "stepLo", 0, 1, 0.01);
    shaderFolder.add(this.settings.shader, "stepHi", 0, 1, 0.01);
  }

  initPost() {
    this.composer = new EffectComposer(this.renderer);
    this.shaderPass = new ShaderPass(GlowPass);
    this.shaderPass.uniforms.u_time = new THREE.Uniform(0);
    this.shaderPass.uniforms.u_starX = new THREE.Uniform(0);
    this.shaderPass.uniforms.u_width = new THREE.Uniform(this.width);
    this.shaderPass.uniforms.u_height = new THREE.Uniform(
      this.height
    );

    this.composer.addPass(this.shaderPass);
  }

  glowPlane!: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;

  addGlowPlane() {
    const geometry = new THREE.PlaneGeometry(300, 300);

    const material = new THREE.ShaderMaterial({
      transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,

      uniforms: {
        time: new THREE.Uniform(0),
        waveScale: new THREE.Uniform(this.settings.waveScale),
        width: new THREE.Uniform(window.innerWidth),
        height: new THREE.Uniform(window.innerHeight),
        stepLo: new THREE.Uniform(this.settings.stepLo),
        stepHi: new THREE.Uniform(this.settings.stepHi)
      }
    });

    this.glowPlane = new THREE.Mesh(geometry, material);
    this.scene.add(this.glowPlane);
  }

  addObjects() {
    this.addGlowPlane();
  }

  render() {
    if (!this.state.enabled) return;

    const elapsedTime = this.clock.getElapsedTime();

    this.glowPlane.material.uniforms.time.value = elapsedTime;
    this.glowPlane.material.uniforms.waveScale.value =
      this.settings.shader.waveScale;
    this.glowPlane.material.uniforms.stepLo.value =
      this.settings.shader.stepLo;
    this.glowPlane.material.uniforms.stepHi.value =
      this.settings.shader.stepHi;

    if (post) {
      // Create brush comp texture
      this.renderer.setRenderTarget(this.preTexture);

      // Render pre scene
      this.renderer.render(this.preScene, this.camera);

      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }

    window.requestAnimationFrame(this.render.bind(this));
  }

  destroy() {
    this.renderer.dispose();
    this.composer?.dispose();
    //this.shaderPass.dispose();
    this.state.enabled = false;
    this.gui.destroy();
    themeManager.off();
  }
}

export function createScene({
  onMount,
  showGui
}: {
  onMount: (arg: () => void) => void;
  showGui?: boolean;
}) {
  onMount(() => {
    const scene = new GlowScene();
    scene.render();

    if (showGui) {
      scene.gui.show();
    }

    return () => {
      scene.destroy();
    };
  });
}
