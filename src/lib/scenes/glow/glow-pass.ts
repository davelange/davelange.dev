export const GlowPass = {
  name: "Glow",

  uniforms: {
    u_time: { value: 0.0 },
    u_displacement: { value: null },
    u_waveScale: { value: 10 },
    u_progress: { value: 0 },
    u_starX: { value: 0 },
    u_showWaves: { value: false },
    u_width: { value: 0 },
    u_height: { value: 0 },
    u_lakes: { value: null },
    u_starTexture: { value: null },
    u_paperTexture: { value: null },
    u_bgColor: { value: null },
    u_bgColorSecondary: { value: null }
  },

  vertexShader: /* glsl */ `
    
            varying vec2 vUv;
    
            void main() {
    
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );  
            }`,

  fragmentShader: /* glsl */ `
              
              varying vec2 vUv;
              
              
              void main() {                  
                gl_FragColor = vec4(vUv, 1., 1.);              
              }          
            `
};
