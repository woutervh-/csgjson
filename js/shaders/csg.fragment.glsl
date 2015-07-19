/**
 * Copyright 2015 Wouter van Heeswijk
 */

precision mediump float;

varying vec2 vPosition;
varying vec3 vEye;
varying vec3 vCenter;
varying vec3 vUp;

float castRay(vec3 rayOrigin, vec3 rayDirection) {
    return 0.0;
}

void main() {
    gl_FragColor = vec4(abs(vPosition.xy), 0.0, 1.0);
}
