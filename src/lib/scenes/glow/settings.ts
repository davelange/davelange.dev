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
    baseSize: 50
  }
};

export const gradientColors = [
  new THREE.Color(0x515890).convertLinearToSRGB(), // dark blue
  new THREE.Color(0x8f75ea).convertLinearToSRGB() // dark purple
];
