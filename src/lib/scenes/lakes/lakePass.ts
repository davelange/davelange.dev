export const LakePass = {
  name: "Lake",

  uniforms: {
    u_time: { value: 0.0 },
    u_displacement: { value: null },
    u_wave_scale: { value: 10 },
    u_progress: { value: 0 },
    u_star_x: { value: 0 },
    u_show_waves: { value: false },
    u_width: { value: 0 },
    u_height: { value: 0 },
    u_lakes: { value: null },
    u_star_texture: { value: null },
    u_paper_texture: { value: null },
    u_bg_color: { value: null },
    u_bg_color_secondary: { value: null },
  },

  vertexShader: /* glsl */ `

          varying vec2 vuv;

          void main() {

              vuv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          }`,

  fragmentShader: /* glsl */ `
            struct Lake {
                vec2 position;
                float radius;
            };
            
            uniform float u_time;
            uniform float u_progress;
            uniform float u_star_x;
            uniform Lake u_lakes[6];
            
            uniform float u_wave_scale;
            uniform bool u_show_waves;
            
            uniform float u_width;
            uniform float u_height;
            
            uniform vec3 u_bg_color;
            uniform vec3 u_bg_color_secondary;
            
            uniform sampler2D u_star_texture;
            uniform sampler2D u_paper_texture;
            uniform sampler2D u_displacement;

            varying vec2 vuv;

            float threshold = 0.001;
            float bank_depth = 100.0;
            float perspective_factor = 3.8;
            float PI = 3.141592653589793238;

            vec2 adjust_lake_vec(vec2 pos, vec2 vuv, float aspect) {
                vec2 pre = vec2(vuv - pos);
                pre.x *= aspect;
                pre.y *= perspective_factor - u_progress * perspective_factor;
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

                vec4 bg_color = vec4(u_bg_color, 1.);
                vec4 bg_color_secondary = vec4(u_bg_color_secondary, 1.);
                vec4 final_color = bg_color;

                // Center point
                vec2 p = 2. * vuv - vec2(1.);

                // Time
                float time_slow = u_time * 0.1;

                // Aspect ratio
                float aspect = u_width / u_height;

                // Lakes def
                for(int i = 0; i <= u_lakes.length(); ++i) {
                    lakes[i].radius = u_lakes[i].radius / 1000.;
                    lakes[i].position = adjust_lake_vec(u_lakes[i].position, vuv, aspect);
                }

                //Waves
                vec2 waves = vec2(p.x * 0.3, p.y * 0.4);
                waves += 0.17 * cos(u_wave_scale * 3.7 * waves.yx + 1.23 * time_slow  * vec2(2.2, 3.4));
                waves += 0.3 * sin(u_wave_scale * 2.3 * waves.xy + 5.5 * time_slow * vec2(3.2, 1.3));
                waves += 0.2 * sin(u_wave_scale * 0.4 * waves.xy + 2.5 * time_slow * vec2(8.2, 1.));
                float wave_intensity = smoothstep(0.5, 0.91, 1. - length(waves));

                //Displacement
                float displacement = texture2D(u_displacement, vuv).r;
                float theta = displacement * 2.0 * PI;
                vec2 dir = vec2(sin(theta), cos(theta));

                //Stars
                vec2 star_size = p * (2. - ((u_progress - 0.02) * 1.3));
                star_size.x += (time_slow * u_star_x);
                vec4 star_texture = texture2D(u_star_texture, star_size + dir * displacement * 0.07);
                float star_alpha_post = smoothstep(0.001, 0.4, max(0., star_texture.r - wave_intensity) );

                //Paper
                vec2 paper_point = vuv;
                float alt = sin(u_time * 8.);

                if(alt < 0.) {
                    paper_point = vec2(vuv.y, vuv.x);
                }
                vec4 paper_texture = texture2D(u_paper_texture, paper_point * 3.);

                // Render lakes
                float cut_off = 0.;
                bank_depth = floor(bank_depth - 99. * (pow(vuv.y, 5.))); // Reduce bank depth in perspective

                int lake_count = lakes.length();
                vec4 star_val = vec4(vec3(star_alpha_post), 1.);

                for(float i = 0.; i < bank_depth; i++) {
                    float intensity = 0.0;
                    vec2 step_offset = vec2(0., 0.001 * i);

                    for(int j = 0; j < lake_count; j++) {
                        vec2 offset_pos = lakes[j].position + step_offset;                        
                        float d = length(offset_pos);
                    
                        intensity += lakes[j].radius / ((d * d) + threshold);
                    }

                    float to_color_alpha = smoothstep(0.10, 0.1001, intensity);

                    if(i == (bank_depth - 1.)) {
                        // Actual lake
                        final_color = mix(final_color, star_val, to_color_alpha);
                    } else {
                        // Cut off for depth
                        if(i == 0.) {
                            cut_off = to_color_alpha;
                        }
                        // Banks
                        final_color = mix(final_color, bg_color_secondary, to_color_alpha);
                    }
                }

                // Bring up bg color to cut off lake depth
                final_color = mix(final_color, bg_color,  max(0., 1. - cut_off - u_progress));

                // Brush texture
                final_color = vec4(blendMultiply(final_color.rgb, paper_texture.rgb, 0.85), 1.);


                if(u_show_waves) {
                    gl_FragColor = vec4(wave_intensity, 0.,0., 1.);

                } else {
                    //final_color += vec4(displacement, 0.,0.,1.);
                    gl_FragColor = final_color;
                    //gl_FragColor = vec4(displacement, 0.,0.,1.);
                    //gl_FragColor = vec4(paper_texture.rgb, 1.);
                    //gl_FragColor = vec4(alt, 0., 0., 1.);
                }

            }          
          `,
};
