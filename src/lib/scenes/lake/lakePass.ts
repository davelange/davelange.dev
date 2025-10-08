export const LakePass = {
  name: "Lake",

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
    u_bgColorSecondary: { value: null },
  },

  vertexShader: /* glsl */ `
  
          varying vec2 vUv;
  
          void main() {
  
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );  
          }`,

  fragmentShader: /* glsl */ `
            struct Lake {
                vec2 position;
                float radius;
            };
            
            uniform float u_time;
            uniform float u_progress;
            uniform float u_starX;
            uniform Lake u_lakes[6];
            
            uniform float u_waveScale;
            uniform bool u_showWaves;
            
            uniform float u_width;
            uniform float u_height;
            
            uniform vec3 u_bgColor;
            uniform vec3 u_bgColorSecondary;
            
            uniform sampler2D u_starTexture;
            //uniform sampler2D u_brushTexture;
            uniform sampler2D u_paperTexture;
            uniform sampler2D u_displacement;
            
            varying vec2 vUv;
                                    
            float threshold = 0.001;
            float bankDepth = 100.0;
            float perspectiveFactor = 3.8;
            float PI = 3.141592653589793238;
            
            vec2 adjustLakeVec(vec2 pos, vec2 vUv, float aspect) {
                vec2 pre = vec2(vUv - pos);
                pre.x *= aspect;
                pre.y *= perspectiveFactor - u_progress * perspectiveFactor;                
                return pre;
            }          
            
            vec3 blendMultiply(vec3 base, vec3 blend) {
                return base*blend;
            }

            vec3 blendMultiply(vec3 base, vec3 blend, float opacity) {
                return (blendMultiply(base, blend) * opacity + base * (1.0 - opacity));
            }
            
            void main() {
                Lake lakes[6];

                vec4 bgColor = vec4(u_bgColor, 1.);
                vec4 bgColorSecondary = vec4(u_bgColorSecondary, 1.);
                vec4 finalColor = bgColor;                
                
                // Center point
                vec2 p = 2. * vUv - vec2(1.);
            
                // Time
                float timeSlow = u_time * 0.1;
            
                // Aspect ratio                                                                                      
                float aspect = u_width / u_height;
            
                // Lakes def    
                for(int i = 0; i <= u_lakes.length(); ++i) {
                    lakes[i].radius = u_lakes[i].radius / 1000.;
                    lakes[i].position = adjustLakeVec(u_lakes[i].position, vUv, aspect);
                }
                
                //Waves
                vec2 waves = vec2(p.x * 0.3, p.y * 0.4);
                waves += 0.17 * cos(u_waveScale * 3.7 * waves.yx + 1.23 * timeSlow  * vec2(2.2, 3.4));
                waves += 0.3 * sin(u_waveScale * 2.3 * waves.xy + 5.5 * timeSlow * vec2(3.2, 1.3));
                waves += 0.2 * sin(u_waveScale * 0.4 * waves.xy + 2.5 * timeSlow * vec2(8.2, 1.));    
                float waveIntensity = smoothstep(0.5, 0.91, 1. - length(waves));
                
                //Displacement
                float displacement = texture2D(u_displacement, vUv).r;
                float theta = displacement * 2.0 * PI;
                vec2 dir = vec2(sin(theta), cos(theta));    		                                
                
                //Stars
                vec2 starSize = p * (2. - ((u_progress - 0.02) * 1.3));
                starSize.x += (timeSlow * u_starX);                                
                vec4 starTexture = texture2D(u_starTexture, starSize + dir * displacement * 0.07);
                float starAlphaPost = smoothstep(0.001, 0.4, max(0., starTexture.r - waveIntensity) );
                       
                //Paper
                vec2 paperPoint = vUv;
                float alt = sin(u_time * 8.);

                if(alt < 0.) {
                    paperPoint = vec2(vUv.y, vUv.x);
                }
                vec4 paperTexture = texture2D(u_paperTexture, paperPoint * 3.);
                
                // Render lakes
                float cutOff = 0.;                
                bankDepth = floor(bankDepth - 99. * (pow(vUv.y, 5.))); // Reduce bank depth in perspective
            
                for(float i = 0.; i < bankDepth; i++) {            
                    float intensity = 0.0;        
                    float d = 0.;      
                    for(int j = 0; j < lakes.length(); j++) {
                        d = length(lakes[j].position);
                        intensity += lakes[j].radius / (d * d + threshold);
                        lakes[j].position.y += 0.001;
                    }       
                    
                    float toColorAlpha = smoothstep(0.10, 0.1001, intensity);                     
                    
                    if(i == (bankDepth - 1.)) {
                        // Actual lake
                        finalColor = mix(finalColor, vec4(vec3(starAlphaPost),1.), toColorAlpha);        
                    } else {
                        // Cut off for depth
                        if(i == 0.) {
                            cutOff = toColorAlpha;
                        }
                        // Banks
                        finalColor = mix(finalColor, bgColorSecondary, toColorAlpha);
                    }  
                }
            
                // Bring up bg color to cut off lake depth
                finalColor = mix(finalColor, bgColor,  max(0., 1. - cutOff - u_progress));                        
                
                // Brush texture
                finalColor = vec4(blendMultiply(finalColor.rgb, paperTexture.rgb, 0.85), 1.);
                
                        
                if(u_showWaves) { 
                    gl_FragColor = vec4(waveIntensity, 0.,0., 1.);    
                
                } else {
                    gl_FragColor = finalColor;
                    //gl_FragColor = vec4(displacement, 0.,0.,1.);
                    //gl_FragColor = vec4(paperTexture.rgb, 1.);
                    //gl_FragColor = vec4(alt, 0., 0., 1.);
                }
            
            }          
          `,
};
