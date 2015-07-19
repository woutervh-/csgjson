/**
 * Copyright 2015 Wouter van Heeswijk
 */

attribute vec2 position;

uniform vec3 eye;
uniform vec3 center;
uniform vec3 up;

varying vec2 vPosition;
varying vec3 vEye;
varying vec3 vCenter;
varying vec3 vUp;

void main() {
    vPosition = position;
    vEye = eye;
    vCenter = center;
    vUp = up;
    gl_Position = vec4(vPosition, 0.0, 1.0);
}
