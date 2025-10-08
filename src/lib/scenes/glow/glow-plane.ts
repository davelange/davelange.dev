export const GlowPlane = {
  name: "GlowPlane",

  uniforms: {
    time: 0,
    waveScale: 0,
    width: 0,
    height: 0,
    stepLo: 0,
    stepHi: 0
  },

  vertexShader: /* glsl */ `
    
    varying vec2 vUv;

    void main() {

        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );  
    }`,

  fragmentShader: /* glsl */ `
        
    varying vec2 vUv;        

    uniform float progress;
    uniform float time;
    uniform float waveScale;
    uniform float width;
    uniform float height;
    uniform float stepLo;
    uniform float stepHi;
    
    float radius = 0.004;
    float threshold = 0.003;

    vec3 bgColor = vec3(0.0, 0.0, 0.0);
    //vec3 bgColor = vec3(1.0, 0.0, 0.0);
    vec4 blue = vec4(0.29, 0.39, 0.99, 1.);
        
    void main() {    
        // Center point
        vec2 p = 2. * vUv - vec2(1.);
        // Time
        float timeSlow = time * 0.08;

        // Aspect
        vec2 resolution = vec2(width, height);
        float aspect = width / height;

        vec3 finalColor = bgColor;

        // Waves
        vec2 waves = p; 


        waves += 0.17 * cos(waveScale * 3.7 * waves.yx + 1.23 * timeSlow  * vec2(2.2, 3.4));
        waves -= 0.3 * sin(waveScale * -2.3 * waves.xy + 5.5 * timeSlow * vec2(3.2, 1.3));
        float dist = 1. - length(waves);
        float distFromWave = smoothstep(stepLo, stepHi, dist);

        // Main color area    
        //finalColor += distFromWave * 0.9;
        //finalColor.b += smoothstep(stepLo - 0.03,stepHi, dist);
        //finalColor.r += 0.3 * smoothstep(stepHi - 0.03,stepHi, dist); 

        vec2 debug = p; 
        debug += 0.17 * cos(waveScale * 3.7 * waves.yx + 1.23 * timeSlow  * vec2(2.2, 3.4));
        finalColor += length(debug);
           
        gl_FragColor = vec4(finalColor, 1.);
    }`
};
