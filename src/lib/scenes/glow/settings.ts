import * as THREE from "three";

export const settings = {
  shader: {
    waveScale: 1.4,
    stepLo: 0.13,
    stepHi: 0.68
  },
  particles: {
    count: 40,
    spread: 2,
    baseSize: 50,
    baseColor: new THREE.Color(0xb7caf5).convertLinearToSRGB(),
    accentColor: new THREE.Color(0xec7bf4).convertLinearToSRGB()
  },
  gradient: {
    opacity: 0.3,
    fromColor: new THREE.Color(0x515890).convertLinearToSRGB(),
    toColor: new THREE.Color(0x7589ea).convertLinearToSRGB()
  }
};
