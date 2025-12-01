vec3 blue = vec3(0.39, 0.39, 0.99);

void main() {
// Light point
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 10.0);

    gl_FragColor = vec4(blue, strength);

    #include <colorspace_fragment>
}