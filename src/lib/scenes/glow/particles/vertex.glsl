uniform float uSize;
uniform float uTime;
uniform float uMouseX;

attribute float aScale;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    modelPosition.y += sin((uTime + modelPosition.z) * 0.4 * (modelPosition.y * 0.5)) * 0.1;

    // Rotate

    //if(uMouseX != 0.0) {
    //    float angle = atan(uMouseX, modelPosition.z);
    //    float distanceToCenter = length(modelPosition.xz);
    //    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
    //    angle += angleOffset;
    //    modelPosition.x += cos(angle) * distanceToCenter;
    //    modelPosition.z = sin(angle) * distanceToCenter;
    //}

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / -viewPosition.z);

    gl_Position = projectedPosition;

}