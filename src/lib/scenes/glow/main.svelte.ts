import * as THREE from "three";

import {
  EffectComposer,
  OrbitControls,
  RoundedBoxGeometry,
  ShaderPass
} from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";
import { GlowRaysPass } from "./glow-rays-pass";
import { Tween } from "svelte/motion";
import { expoOut } from "svelte/easing";
import { themeManager } from "$lib/theme.svelte";
import vertex from "./glow-plane/vertex.glsl?raw";
import fragment from "./glow-plane/fragment.glsl?raw";
import particleVertex from "./particles/vertex.glsl?raw";
import particleFragment from "./particles/fragment.glsl?raw";
import { loadTexture } from "../lakes/utils";
import { FXAAPass } from "three/examples/jsm/postprocessing/FXAAPass.js";
import { MouseTracker } from "./mouse-tracker";
import { settings } from "./settings";
import { createSceneFactory } from "../index.svelte";

export class GlowScene {
  scene = new THREE.Scene();
  composer!: EffectComposer;
  shaderPass!: ShaderPass;
  renderer = new THREE.WebGLRenderer();
  canvas!: HTMLCanvasElement;
  camera = new THREE.PerspectiveCamera();
  clock = new THREE.Clock();
  controls!: OrbitControls;
  gui = new GUI();

  width = 0;
  height = 0;

  // Scenes
  preScene = new THREE.Scene();
  preTexture = new THREE.WebGLRenderTarget();
  glowScene = new THREE.Scene();
  glowTexture = new THREE.WebGLRenderTarget();

  // State
  state = {
    enabled: true,
    isEditing: false
  };
  settings = settings;

  // Objects
  cube!: THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhysicalMaterial>;
  glowPlane!: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  particles!: THREE.Points<
    THREE.BufferGeometry,
    THREE.ShaderMaterial
  >;

  // Tweens
  cubeRotationTween = new Tween([0.1, 0.3], {
    duration: 1500,
    easing: expoOut
  });
  cubePositionTween = new Tween([0, 0], {
    duration: 1500,
    easing: expoOut
  });

  init() {
    this.canvas = document.querySelector(
      "canvas.webgl"
    ) as HTMLCanvasElement;

    this.setSize();
    this.setupRenderer();
    this.setupCamera();
    this.setupResize();
    this.addObjects();
    this.initPost();

    this.controls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.initSettings();
  }

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

    const controlsFolder = this.gui.addFolder("Controls");
    this.controls.enabled = false;
    controlsFolder
      .add(this.controls, "enabled")
      .name("Orbit Controls");

    this.gui.hide();
  }

  initPost() {
    this.composer = new EffectComposer(this.renderer);
    this.shaderPass = new ShaderPass(GlowRaysPass);
    this.shaderPass.uniforms.u_time = new THREE.Uniform(0);
    this.shaderPass.uniforms.u_texture = new THREE.Uniform(null);
    this.shaderPass.uniforms.u_glow_texture = new THREE.Uniform(null);
    this.shaderPass.uniforms.u_reveal_progress = new THREE.Uniform(0);

    this.composer.addPass(this.shaderPass);
    this.composer.addPass(new FXAAPass());
  }

  addGlowPlane() {
    const size = 0.8;
    const geometry = new THREE.PlaneGeometry(size, size);

    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        time: new THREE.Uniform(0),
        waveScale: new THREE.Uniform(this.settings.shader.waveScale),
        width: new THREE.Uniform(this.width),
        height: new THREE.Uniform(this.height),
        stepLo: new THREE.Uniform(this.settings.shader.stepLo),
        stepHi: new THREE.Uniform(this.settings.shader.stepHi)
      }
    });

    this.glowPlane = new THREE.Mesh(geometry, material);
    this.glowPlane.position.z = -0.5;
    this.preScene.add(this.glowPlane);
  }

  cubeRestingRotation = new THREE.Vector2(0, 0);
  cubeRestingRotationEnabled = true;

  updateCube() {
    //Rotation
    const [rx, ry] = this.cubeRotationTween.current;

    this.cube.rotation.x =
      rx * (Math.PI * this.settings.cube.rotationForce);
    this.cube.rotation.y =
      ry * (Math.PI * this.settings.cube.rotationForce);

    this.glowPlane.rotation.x =
      rx * (Math.PI * this.settings.cube.rotationForce * 0.2);
    this.glowPlane.rotation.y =
      ry * (Math.PI * this.settings.cube.rotationForce * 0.2);

    // Position
    const [px, py] = this.cubePositionTween.current;

    this.cube.position.x = px * 0.1;
    this.cube.position.y = py * 0.1 * -1;
    this.glowPlane.position.y = py * 0.06 * -1;
  }

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

    // Settings
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
    folder.add(
      this.settings.animation,
      "cubeRevealProgress",
      0,
      1,
      0.01
    );

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
      .onChange((value: number) => {
        ambientLight.color.setHex(value);
      });

    const dirFolder = lightFolder.addFolder("Directional");
    dirFolder.add(directionalLight, "intensity", 0, 2, 0.01);
    dirFolder
      .addColor({ color: directionalLight.color.getHex() }, "color")
      .onChange((value: number) => {
        directionalLight.color.setHex(value);
      });
    dirFolder.add(directionalLight.position, "x", -10, 10, 0.1);
    dirFolder.add(directionalLight.position, "y", -10, 10, 0.1);
    dirFolder.add(directionalLight.position, "z", -10, 10, 0.1);

    const ptFolder = lightFolder.addFolder("Point");
    ptFolder.add(pointLight, "intensity", 0, 2, 0.01);
    ptFolder
      .addColor({ color: pointLight.color.getHex() }, "color")
      .onChange((value: number) => {
        pointLight.color.setHex(value);
      });
    ptFolder.add(pointLight.position, "x", -10, 10, 0.1);
    ptFolder.add(pointLight.position, "y", -10, 10, 0.1);
    ptFolder.add(pointLight.position, "z", -10, 10, 0.1);

    lightFolder.close();
    ambFolder.close();
    dirFolder.close();
    ptFolder.close();

    this.preScene.add(lightGroup);
  }

  handleParticlesUpdate() {
    this.particles.clear();
    this.preScene.remove(this.particles);
    this.gui.folders.find((f) => f._title === "Particles")?.destroy();
    this.addParticles();
  }

  addParticles() {
    // Settings
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
      .max(100)
      .onFinishChange(this.handleParticlesUpdate.bind(this));
    folder
      .addColor(this.settings.particles, "baseColor")
      .onFinishChange(this.handleParticlesUpdate.bind(this));
    folder
      .addColor(this.settings.particles, "accentColor")
      .onFinishChange(this.handleParticlesUpdate.bind(this));

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(
      this.settings.particles.count * 3
    );
    const scales = new Float32Array(this.settings.particles.count);
    const colors = new Float32Array(
      this.settings.particles.count * 3
    );

    for (let i = 0; i <= this.settings.particles.count * 3; i++) {
      const idx = i * 3;
      positions[idx] =
        (Math.random() - 0.5) * this.settings.particles.spread;
      positions[idx + 1] =
        (Math.random() - 0.5) * this.settings.particles.spread;
      positions[idx + 2] =
        Math.random() * this.settings.particles.spread;

      scales[i] = Math.random() * 2;

      const colorPoint = this.settings.particles.baseColor
        .clone()
        .lerp(this.settings.particles.accentColor, Math.random());
      colors[idx] = colorPoint.r;
      colors[idx + 1] = colorPoint.g;
      colors[idx + 2] = colorPoint.b;
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    geometry.setAttribute(
      "aScale",
      new THREE.BufferAttribute(scales, 1)
    );
    geometry.setAttribute(
      "aColor",
      new THREE.BufferAttribute(colors, 3)
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
        },
        uMouseForce: {
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
    this.addGlowPlane();
    this.addCube();
    this.addLights();
    this.addParticles();
  }

  toggleEditScene() {
    this.state.isEditing = !this.state.isEditing;
    if (this.state.isEditing) {
      this.gui.show();
    } else {
      this.gui.hide();
    }
  }

  mouseTracker = new MouseTracker({
    threshold: 30,
    window: 1200,
    onForce: ({ x, y }) => {
      this.cubeRotationTween.set([y, x]);
      this.cubePositionTween.set([x, y]);
    },
    gui: this.gui
  });

  render() {
    if (!this.state.enabled) return;

    this.controls.update();

    const elapsedTime = this.clock.getElapsedTime();

    this.updateCube();

    // Glow plane uniforms
    this.glowPlane.material.uniforms.time.value = elapsedTime;
    this.glowPlane.material.uniforms.waveScale.value =
      this.settings.shader.waveScale;
    this.glowPlane.material.uniforms.stepLo.value =
      this.settings.shader.stepLo;
    this.glowPlane.material.uniforms.stepHi.value =
      this.settings.shader.stepHi;

    // Particles uniforms
    this.particles.material.uniforms.uTime.value = elapsedTime;

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
    this.shaderPass.material.uniforms.u_reveal_progress.value =
      this.settings.animation.cubeRevealProgress;

    // Render
    this.composer.render();

    window.requestAnimationFrame(this.render.bind(this));
  }

  destroy() {
    this.renderer.dispose();
    this.composer?.dispose();
    this.state.enabled = false;
    this.gui.destroy();
    this.mouseTracker.destroy();
    themeManager.off();
  }
}

const createScene = createSceneFactory(GlowScene);

export { createScene };
