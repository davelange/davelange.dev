uniform float uTime;

varying vec3 vColor;

void main() {
    float distToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = 1.0 - distToCenter;
    strength = pow(strength, 20.0);

    float alpha = strength * (sin(uTime + (vColor.r * 20.)) + 0.1);

    gl_FragColor = vec4(vColor, alpha);

    #include <colorspace_fragment>
}