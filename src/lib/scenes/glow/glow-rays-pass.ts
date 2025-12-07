export const GlowRaysPass = {
  name: "GlowRaysPass",

  uniforms: {
    u_time: { value: 0.0 },
    u_texture: { value: null },
    u_glow_texture: { value: null },
    u_reveal_progress: { value: 0 }
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
              uniform sampler2D u_texture;
              uniform sampler2D u_glow_texture;
              uniform float u_reveal_progress;

              float samples = 40.;
              float PI = 3.141592653589793238;

              vec3 bgColor = vec3(0.0, 0.0, 0.0);
              vec3 blue = vec3(0.29, 0.1, 0.99) / 20.;

              void main() {      
                float slowTime = u_time * 0.01;

                vec2 toCenter = vec2(0.5) - vUv;
                vec3 afterGlow = vec3(0., 0., 0.);
                vec4 tex = texture2D(u_texture, vUv);              
                vec4 glowTex = texture2D(u_glow_texture, vUv);                              
                
                // Rays
                for(float i = 0.; i < samples; i++ ) {
                  float lerp = i/samples;
                  float weight = sin(lerp * PI) * 1.3;
              
                  vec4 tsample = texture2D(u_glow_texture, vUv + toCenter * lerp + vec2(0.01));              
                                    
                  afterGlow += smoothstep(0.2, 1., tsample.r * 0.5 * weight) ;
                }
                
                float factor = 0.5;
                factor += (0.4 * sin(vUv.x * 3.1));
                afterGlow.rgb /= 30.;                
                
                //tex = mix(tex, tex+ vec4(afterGlow, 1.) * factor, u_reveal_progress);
                tex = mix(tex, tex+ vec4(afterGlow, 1.) * factor, u_reveal_progress);
                
                gl_FragColor = tex;              
              }          
            `
};
