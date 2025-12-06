import * as THREE from "three";
import {
  EffectComposer,
  ShaderPass
} from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";
import { loadTexture, rand, wait } from "./utils";
import { colorsDark, colorsLight, lakeConfigs, text } from "./config";
import { RippleManager } from "./ripple";
import { LakePass } from "./lakePass";
import { Tween } from "svelte/motion";
import { cubicOut, expoInOut } from "svelte/easing";
import { themeManager } from "$lib/theme.svelte";
import { createPubSub } from "$lib/pub";

type Phase = keyof typeof colorsLight;

export class HomeScene {
  scene = new THREE.Scene();
  composer!: EffectComposer;
  shaderPass!: ShaderPass;
  renderer = new THREE.WebGLRenderer();
  canvas: HTMLCanvasElement;
  camera = new THREE.OrthographicCamera();
  clock = new THREE.Clock();
  lakeConfig = lakeConfigs[0];
  colorConfig =
    themeManager.theme === "dark" ? colorsDark : colorsLight;

  width = 0;
  height = 0;

  greetingElement: Element;
  subtitleElement: Element;

  state = {
    enabled: true,
    phase: 0 as Phase,
    isFirstRun: true,
    isEditing: false
  };

  pubs = createPubSub(["phase"]);

  timeouts: Array<ReturnType<typeof setTimeout>> = [];

  wait(ms: number) {
    return new Promise((res) => {
      this.timeouts.push(setTimeout(res, ms));
    });
  }

  timeout(cb: () => void, ms: number) {
    this.timeouts.push(setTimeout(cb, ms));
  }

  clearTimeouts() {
    this.timeouts.forEach((timeout) => clearTimeout(timeout));
    this.timeouts = [];
  }

  settings = {
    shader: {
      u_waveScale: 10,
      u_showWaves: false,
      u_progress: new Tween(0, { duration: 2800, easing: expoInOut }),
      u_starX: new Tween(0, { duration: 20, easing: cubicOut }),
      u_bgColor: new THREE.Color(
        this.colorConfig[0].primary
      ).convertLinearToSRGB(),
      u_bgColorSecondary: new THREE.Color(
        this.colorConfig[0].secondary
      ).convertLinearToSRGB()
    },
    rippleIntensity: 0.07
  };
  gui = new GUI();
  rippleManager = new RippleManager();

  preScene = new THREE.Scene();
  preTexture = new THREE.WebGLRenderTarget();

  mouse = new THREE.Vector2(0, 0);
  prevMouse = new THREE.Vector2(0, 0);

  constructor() {
    console.log("init scene");
    this.canvas = document.querySelector(
      "canvas.webgl"
    ) as HTMLCanvasElement;
    this.greetingElement = document.querySelector(
      '[data-js="greeting"]'
    ) as Element;
    this.subtitleElement = document.querySelector(
      '[data-js="subtitle"]'
    ) as Element;

    this.setSize();
    this.setupRenderer();
    this.setupCamera();
    this.setupResize();
    this.trackMouse();
    this.addObjects();
    this.initPost();
    this.setupEvents();
    this.initSettings();

    this.pubs.publish("phase", this.state.phase);
  }

  get nextPhase() {
    return ((this.state.phase + 1) % lakeConfigs.length) as Phase;
  }

  async toggleText({
    element,
    config,
    interval
  }: {
    element: Element | null;
    config: typeof text.greetingTransformation;
    interval: number;
  }): Promise<boolean | undefined> {
    if (!element) return;
    const promises: Array<Promise<boolean>> = [];

    for (let index = 0; index < element.children.length; index++) {
      const el = element.children[index];

      const promise = new Promise<boolean>((resolve) =>
        setTimeout(
          () => {
            el.classList.toggle("hidden");

            if (config[index].apply) {
              setTimeout(() => {
                el.textContent = config[index].char;

                setTimeout(() => {
                  el.textContent = config[index].original;
                }, interval);
              }, interval);
            }
            resolve(true);
          },
          interval * index + 1 + rand(0, interval / 2)
        )
      );
      promises.push(promise);
    }

    await Promise.all(promises);
  }

  setupEvents() {
    this.pubs.on("phase", () => {
      this.updateLakePhase();
      this.initUpdateLakes();
      this.updateColorSettings();
    });
    const id = themeManager.on("themeChange", (theme) => {
      console.log("themeChange in scene", theme);
      this.colorConfig = theme === "dark" ? colorsDark : colorsLight;
      this.updateColorSettings();
    });

    document
      .querySelector('[data-js="edit-button"]')
      ?.addEventListener("click", () => {
        this.toggleEditScene();
      });
  }

  updateColorSettings() {
    this.settings.shader.u_bgColor.set(
      new THREE.Color(
        this.colorConfig[this.state.phase].primary
      ).convertLinearToSRGB()
    );
    this.settings.shader.u_bgColorSecondary.set(
      new THREE.Color(
        this.colorConfig[this.state.phase].secondary
      ).convertLinearToSRGB()
    );
    this.gui.controllers.forEach((controller) => {
      controller.updateDisplay();
    });
  }

  updateLakePhase() {
    this.lakeConfig = lakeConfigs[this.state.phase];
    // Init tween start values
    this.lakeConfig.map((item) => {
      item.tween.set(item.position, { duration: 0 });
      item.radiusTween.set(this.state.isFirstRun ? 0 : item.radius, {
        duration: 0
      });
    });
    this.updateColorSettings();
  }

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
    this.gui
      .add({ u_progress: 0 }, "u_progress", 0, 1, 0.001)
      .name("Zoom in progress")
      .onChange((val: number) => {
        this.settings.shader.u_progress.set(val, { duration: 0 });
      });
    this.gui
      .addColor(
        { u_bgColor: this.settings.shader.u_bgColor },
        "u_bgColor"
      )
      .name("Color")
      .onFinishChange((val: string) => {
        this.settings.shader.u_bgColor.set(new THREE.Color(val));
      });
    this.gui
      .addColor(
        {
          u_bgColorSecondary: this.settings.shader.u_bgColorSecondary
        },
        "u_bgColorSecondary"
      )
      .name("Secondary color")
      .onFinishChange((val: string) => {
        this.settings.shader.u_bgColorSecondary.set(
          new THREE.Color(val)
        );
      });

    this.gui
      .add(this.settings, "rippleIntensity", 0, 1.6, 0.01)
      .name("Ripple intensity")
      .onFinishChange((val: number) => {
        this.settings.rippleIntensity = val;
      });

    this.gui.hide();
  }

  get lakeUniforms() {
    return this.lakeConfig.map((item) => ({
      position: item.tween.current,
      radius: item.radiusTween.current
    }));
  }

  initPost() {
    this.composer = new EffectComposer(this.renderer);
    this.shaderPass = new ShaderPass(LakePass);
    this.shaderPass.uniforms.u_time = new THREE.Uniform(0);
    this.shaderPass.uniforms.u_starX = new THREE.Uniform(0);
    this.shaderPass.uniforms.u_width = new THREE.Uniform(this.width);
    this.shaderPass.uniforms.u_height = new THREE.Uniform(
      this.height
    );
    this.shaderPass.uniforms.u_bgColor = new THREE.Uniform(
      this.settings.shader.u_bgColor
    );
    this.shaderPass.uniforms.u_bgColorSecondary = new THREE.Uniform(
      this.settings.shader.u_bgColorSecondary
    );
    this.shaderPass.uniforms.u_starTexture = new THREE.Uniform(
      loadTexture("/assets/stars6.png")
    );
    this.shaderPass.uniforms.u_paperTexture = new THREE.Uniform(
      loadTexture("/assets/paper2.png")
    );

    this.composer.addPass(this.shaderPass);
  }

  async initUpdateLakes() {
    const doUpdate = (idx: number, f: number) => {
      if (this.lakeConfig[idx].disabled) return;

      const { options, target } = this.lakeConfig[idx].update(
        f,
        this.lakeConfig[idx].tween.current
      );

      this.lakeConfig[idx].tween.set(target, options).then(() => {
        doUpdate(idx, f * -1);
      });
    };

    this.lakeConfig.map((item, idx) => {
      doUpdate(idx, 1);

      if (this.state.isFirstRun) {
        item.radiusTween.set(item.radius);
      }
    });
    this.state.isFirstRun = false;
  }

  toggleEditScene() {
    this.state.isEditing = !this.state.isEditing;
    if (this.state.isEditing) {
      this.clearTimeouts();

      this.settings.shader.u_starX.set(1);
      this.settings.shader.u_progress.set(0);
      this.state.phase = 0;
      this.pubs.publish("phase", this.state.phase);

      this.gui.show();
    } else {
      this.moveScene();
      this.gui.hide();
    }
  }

  async moveScene() {
    if (this.state.isEditing) return;

    this.settings.shader.u_starX.set(1);
    await this.wait(6000);
    await this.settings.shader.u_progress.set(1);
    this.state.phase = this.nextPhase;
    this.pubs.publish("phase", this.state.phase);

    await this.toggleText({
      element: this.greetingElement,
      config: text.greetingTransformation,
      interval: 100
    });
    await this.toggleText({
      element: this.subtitleElement,
      config: text.subtitleTransformation,
      interval: 80
    });

    await this.wait(1000);

    this.toggleText({
      element: this.greetingElement,
      config: text.greetingTransformation,
      interval: 40
    });
    this.toggleText({
      element: this.subtitleElement,
      config: text.subtitleTransformation,
      interval: 40
    });
    await this.settings.shader.u_progress.set(0, {
      delay: 500
    });
    this.settings.shader.u_starX.set(0);

    this.moveScene();
  }

  addObjects() {
    this.rippleManager.init({
      count: 60,
      texture: loadTexture("/assets/brush2.png"),
      scene: this.preScene
    });

    window.addEventListener("mousemove", () =>
      this.rippleManager.createRipple({
        mousePos: this.mouse,
        prevMousePos: this.prevMouse
      })
    );

    this.moveScene();
  }

  render() {
    if (!this.state.enabled) return;

    const elapsedTime = this.clock.getElapsedTime();

    this.rippleManager.update(this.settings.rippleIntensity);

    // Create brush comp texture
    this.renderer.setRenderTarget(this.preTexture);

    // Render pre scene
    this.renderer.render(this.preScene, this.camera);

    // Update shader uniforms
    this.shaderPass.uniforms.u_lakes.value = this.lakeUniforms;
    this.shaderPass.uniforms.u_progress.value =
      this.settings.shader.u_progress.current;
    this.shaderPass.uniforms.u_starX.value =
      this.settings.shader.u_starX.current;
    this.shaderPass.uniforms.u_displacement.value =
      this.preTexture.texture;
    this.shaderPass.material.uniforms.u_time.value = elapsedTime;

    this.composer.render();

    window.requestAnimationFrame(this.render.bind(this));
  }

  destroy() {
    this.clearTimeouts();
    this.renderer.dispose();
    this.composer.dispose();
    this.shaderPass.dispose();
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
    const scene = new HomeScene();
    scene.render();

    if (showGui) {
      scene.gui.show();
    }

    return () => {
      scene.destroy();
    };
  });
}
