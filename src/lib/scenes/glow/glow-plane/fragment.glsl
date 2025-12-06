uniform float time;
uniform float waveScale;
uniform float width;
uniform float height;
uniform float stepLo;
uniform float stepHi;

varying vec2 vUv;

vec3 bgColor = vec3(0.0, 0.0, 0.0);
vec4 blue = vec4(0.29, 0.39, 0.99, 1.);

void main() {
    // Center point
    vec2 p = 2. * vUv - vec2(1.);
    // Time
    float timeSlow = time * 0.08;

    // Aspect
    vec2 resolution = vec2(width, height);
    float aspect = width / height;

    // Waves
    vec2 waves = p;
    vec3 finalColor = bgColor;

    waves += 0.17 * cos(waveScale * 3.7 * waves.yx + 1.23 * timeSlow * vec2(2.2, 3.4));
    waves -= 0.3 * sin(waveScale * -2.3 * waves.xy + 5.5 * timeSlow * vec2(3.2, 1.3));
    float dist = 1. - length(waves);
    float distFromWave = smoothstep(stepLo, stepHi, dist);

        // Main color area    
    finalColor += distFromWave * 0.9;
    finalColor.b += smoothstep(stepLo - 0.03, stepHi, dist);
    finalColor.r += 0.3 * smoothstep(stepHi - 0.03, stepHi, dist);

    // Add square fade to black
    vec2 absP = abs(p);
    float squareDistance = max(absP.x, absP.y);
    float fadeToBlack = 1.0 - smoothstep(0.5, 0.9, squareDistance);
    finalColor *= fadeToBlack;

    gl_FragColor = vec4(finalColor, 1.);
}