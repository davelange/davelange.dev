export const GlowPass = {
  name: "Glow",

  uniforms: {
    u_time: { value: 0.0 },
    u_texture: { value: null },
    u_glow_texture: { value: null },
    u_wave_scale: { value: null },
    u_step_lo: { value: null },
    u_step_hi: { value: null },
    width: { value: null },
    height: { value: null }
  },

  vertexShader: /* glsl */ `
    
            varying vec2 vUv;
    
            void main() {
    
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );  
            }`,

  fragmentShader: /* glsl */ `
              
              varying vec2 vUv;
              
              uniform float u_time;
              uniform float width;
              uniform float height;
              uniform sampler2D u_texture;
              uniform sampler2D u_glow_texture;

              float samples = 40.;
              float PI = 3.141592653589793238;

              vec3 bgColor = vec3(0.0, 0.0, 0.0);
              vec4 blue = vec4(0.29, 0.39, 0.99, 1.);

              void main() {      
                vec2 toCenter = vec2(0.5) - vUv;
                vec3 afterGlow = vec3(0., 0., 0.);
                vec4 tex = texture2D(u_texture, vUv);              
                vec4 glowTex = texture2D(u_glow_texture, vUv);              

                float total = 0.;
                for(float i = 0.; i < samples; i++ ) {
                  float lerp = i/samples;
                  float weight = sin(lerp * PI) * 1.3;
                  vec4 tsample = texture2D(u_glow_texture, vUv + toCenter * lerp + vec2(0.01));              
                  
                  afterGlow += smoothstep(0.2, 1., tsample.r * 0.5 * weight) ;
                  
                  
                  total += weight;
                }
                
                afterGlow.rgb /= 20.;
                tex += vec4(afterGlow, 1.) * 0.5;
                
                gl_FragColor = tex;

              }          
            `
};
