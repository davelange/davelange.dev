import * as THREE from "three";
import {
  EffectComposer,
  OrbitControls,
  RoundedBoxGeometry,
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
import particleVertex from "./particles/vertex.glsl?raw";
import particleFragment from "./particles/fragment.glsl?raw";
import { loadTexture } from "../lake/utils";
import { FXAAPass } from "three/examples/jsm/postprocessing/FXAAPass.js";

let post = true;

export class GlowScene {
  scene = new THREE.Scene();
  composer!: EffectComposer;
  shaderPass!: ShaderPass;
  renderer = new THREE.WebGLRenderer();
  canvas: HTMLCanvasElement;
  camera = new THREE.PerspectiveCamera();
  clock = new THREE.Clock();
  controls: OrbitControls;

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
    },
    particles: {
      count: 20,
      spread: 2,
      baseSize: 20
    }
  };
  gui = new GUI();

  preScene = new THREE.Scene();
  glowScene = new THREE.Scene();
  preTexture = new THREE.WebGLRenderTarget();
  glowTexture = new THREE.WebGLRenderTarget();

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
    //this.trackMouse();
    this.addObjects();
    if (post) this.initPost();
    this.setupEvents();
    this.initSettings();

    this.controls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.controls.update();

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
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

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

    this.glowTexture = new THREE.WebGLRenderTarget(
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
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      0.01,
      100
    );
    this.camera.position.set(0, 0, 5);
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
    this.shaderPass.uniforms.u_texture = new THREE.Uniform(null);
    this.shaderPass.uniforms.u_glow_texture = new THREE.Uniform(null);
    this.shaderPass.uniforms.u_point_texture = new THREE.Uniform(
      loadTexture("/assets/paper2.png")
    );
    this.shaderPass.uniforms.u_wave_scale = new THREE.Uniform(null);
    this.shaderPass.uniforms.u_step_lo = new THREE.Uniform(null);
    this.shaderPass.uniforms.u_step_hi = new THREE.Uniform(null);
    this.shaderPass.uniforms.width = new THREE.Uniform(this.width);
    this.shaderPass.uniforms.height = new THREE.Uniform(this.height);

    this.composer.addPass(this.shaderPass);
    this.composer.addPass(new FXAAPass());
  }

  glowPlane!: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  globes: Array<{
    mesh: THREE.Mesh;
    light: THREE.PointLight;
    velocity: THREE.Vector3;
    offset: THREE.Vector3;
  }> = [];

  addGlowPlane() {
    const size = 0.8;
    const geometry = new THREE.PlaneGeometry(size, size);

    const material = new THREE.ShaderMaterial({
      //transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,

      uniforms: {
        time: new THREE.Uniform(0),
        waveScale: new THREE.Uniform(this.settings.waveScale),
        width: new THREE.Uniform(this.width),
        height: new THREE.Uniform(this.height),
        stepLo: new THREE.Uniform(this.settings.stepLo),
        stepHi: new THREE.Uniform(this.settings.stepHi)
      }
    });

    this.glowPlane = new THREE.Mesh(geometry, material);
    this.preScene.add(this.glowPlane);
  }

  cube!: THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhysicalMaterial>;

  addCube() {
    const size = 0.7;
    const geometry = new RoundedBoxGeometry(size, size, size);

    const envTex = loadTexture("/assets/glow/hdri2.jpg");
    envTex.mapping = THREE.EquirectangularReflectionMapping;

    const material = new THREE.MeshPhysicalMaterial({
      roughness: 0.57,
      transmission: 1,
      thickness: 0.39,
      reflectivity: 0.44,
      clearcoat: 0.3,
      clearcoatRoughness: 0,
      metalness: 0.14,
      envMap: envTex,
      envMapIntensity: 2.22
    });

    // settings
    const folder = this.gui.addFolder("Cube");
    folder.add(material, "roughness", 0, 5, 0.01);
    folder.add(material, "transmission", 0, 5, 0.01);
    folder.add(material, "thickness", 0, 5, 0.01);
    folder.add(material, "clearcoat", 0, 5, 0.01);
    folder.add(material, "clearcoatRoughness", 0, 5, 0.01);
    folder.add(material, "reflectivity", 0, 5, 0.01);
    folder.add(material, "metalness", 0, 5, 0.01);
    folder.add(material, "envMapIntensity", 0, 5, 0.01);
    folder.add(material, "visible");

    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.set(0, 0, 1);
    this.preScene.add(this.cube);
  }

  addLights() {
    const lightGroup = new THREE.Group();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    lightGroup.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(
      0xffddaa,
      1.4
    );
    directionalLight.position.set(3, 5, 2);
    lightGroup.add(directionalLight);

    const pointLight = new THREE.PointLight(0xaaffff, 1.63, 10);
    pointLight.position.set(-0.5, -0.5, 2.1);
    pointLight.lookAt(0, 0, 0);
    lightGroup.add(pointLight);

    const lightFolder = this.gui.addFolder("Lights");

    const ambFolder = lightFolder.addFolder("Ambient");
    ambFolder.add(ambientLight, "intensity", 0, 2, 0.01);
    ambFolder
      .addColor({ color: ambientLight.color.getHex() }, "color")
      .onChange((value) => {
        ambientLight.color.setHex(value);
      });

    const dirFolder = lightFolder.addFolder("Directional");
    dirFolder.add(directionalLight, "intensity", 0, 2, 0.01);
    dirFolder
      .addColor({ color: directionalLight.color.getHex() }, "color")
      .onChange((value) => {
        directionalLight.color.setHex(value);
      });
    dirFolder.add(directionalLight.position, "x", -10, 10, 0.1);
    dirFolder.add(directionalLight.position, "y", -10, 10, 0.1);
    dirFolder.add(directionalLight.position, "z", -10, 10, 0.1);

    const ptFolder = lightFolder.addFolder("Point");
    ptFolder.add(pointLight, "intensity", 0, 2, 0.01);
    ptFolder
      .addColor({ color: pointLight.color.getHex() }, "color")
      .onChange((value) => {
        pointLight.color.setHex(value);
      });
    ptFolder.add(pointLight.position, "x", -10, 10, 0.1);
    ptFolder.add(pointLight.position, "y", -10, 10, 0.1);
    ptFolder.add(pointLight.position, "z", -10, 10, 0.1);

    lightFolder.open();
    ambFolder.open();
    dirFolder.open();
    ptFolder.open();

    this.preScene.add(lightGroup);
  }

  particles!: THREE.Points<
    THREE.BufferGeometry,
    THREE.ShaderMaterial
  >;

  handleParticlesUpdate() {
    this.particles.clear();
    this.preScene.remove(this.particles);
    this.addParticles();
  }

  addParticles() {
    const folder = this.gui.addFolder("Particles");
    folder
      .add(this.settings.particles, "count")
      .min(0)
      .max(1000)
      .onFinishChange(this.handleParticlesUpdate.bind(this));
    folder
      .add(this.settings.particles, "spread")
      .min(0)
      .max(5)
      .onFinishChange(this.handleParticlesUpdate.bind(this));
    folder
      .add(this.settings.particles, "baseSize")
      .min(0)
      .max(50)
      .onFinishChange(this.handleParticlesUpdate.bind(this));

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(
      this.settings.particles.count * 3
    );
    const scales = new Float32Array(this.settings.particles.count);

    for (let i = 0; i <= this.settings.particles.count * 3; i++) {
      const idx = i * 3;
      positions[idx] =
        (Math.random() - 0.5) * this.settings.particles.spread;
      positions[idx + 1] =
        (Math.random() - 0.5) * this.settings.particles.spread;
      positions[idx + 2] =
        Math.random() * this.settings.particles.spread;

      scales[i] = Math.random() * 2;
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    geometry.setAttribute(
      "aScale",
      new THREE.BufferAttribute(scales, 1)
    );

    const material = new THREE.ShaderMaterial({
      fragmentShader: particleFragment,
      vertexShader: particleVertex,
      uniforms: {
        uSize: {
          value:
            this.settings.particles.baseSize *
            this.renderer.getPixelRatio()
        },
        uTime: {
          value: 0
        }
      },
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.preScene.add(this.particles);
  }

  addObjects() {
    this.addGradientBg();
    this.addGlowPlane();
    this.addCube();
    this.addLights();
    this.addParticles();
  }

  addGradientBg() {
    const material = new THREE.SpriteMaterial({
      color: 0x515890,
      fog: true,
      map: loadTexture("/assets/glow/grad.png"),
      transparent: true,
      opacity: 0.18
    });

    const folder = this.gui.addFolder("Gradient");
    folder.add(material, "opacity", 0, 1, 0.01);
    folder
      .addColor({ color: material.color.getHex() }, "color")
      .onChange((value) => {
        material.color.setHex(value);
      });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(8, 8, 1);

    this.preScene.add(sprite);
  }

  render() {
    if (!this.state.enabled) return;

    this.controls.update();

    const elapsedTime = this.clock.getElapsedTime();

    this.glowPlane.material.uniforms.time.value = elapsedTime;
    this.glowPlane.material.uniforms.waveScale.value =
      this.settings.shader.waveScale;
    this.glowPlane.material.uniforms.stepLo.value =
      this.settings.shader.stepLo;
    this.glowPlane.material.uniforms.stepHi.value =
      this.settings.shader.stepHi;

    const xAxis = new THREE.Vector3(1, 0, 0);
    const yAxis = new THREE.Vector3(0, 1, 0);

    this.cube.rotateOnWorldAxis(xAxis, 0.001);
    this.cube.rotateOnWorldAxis(yAxis, 0.001);

    this.particles.material.uniforms.uTime.value = elapsedTime;

    if (post) {
      this.renderer.setRenderTarget(this.glowTexture);
      this.cube.visible = false;
      this.renderer.render(this.preScene, this.camera);
      this.cube.visible = true;

      // Render pre scene
      this.renderer.setRenderTarget(this.preTexture);
      this.renderer.render(this.preScene, this.camera);

      // Pass rendered scene texture to shader
      this.shaderPass.uniforms.u_texture.value =
        this.preTexture.texture;
      this.shaderPass.uniforms.u_glow_texture.value =
        this.glowTexture.texture;
      this.shaderPass.material.uniforms.u_time.value = elapsedTime;

      this.composer.render();
    } else {
      this.renderer.render(this.preScene, this.camera);
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
