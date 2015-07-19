/**
 * Copyright 2015 Wouter van Heeswijk
 */

precision mediump float;

varying vec4 vPosition;
varying mat4 vProjection;
varying mat4 vModelView;

void main() {
    gl_FragColor = vec4(abs(vPosition.xyz), 1.0);
}
