import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();

const noop = () => null;

export function loadTexture(path: string) {
  const texture = textureLoader.load(path, noop, noop, () => {
    throw new Error(`Failed to load texture ${path}`);
  });

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  return texture;
}

export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
