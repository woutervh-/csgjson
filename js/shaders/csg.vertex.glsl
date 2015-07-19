/**
 * Copyright 2015 Wouter van Heeswijk
 */

attribute vec2 position;

uniform mat4 projection;
uniform mat4 modelView;

varying vec4 vPosition;
varying mat4 vProjection;
varying mat4 vModelView;

void main() {
    vProjection = projection;
    vModelView = modelView;
    gl_Position = vPosition = vec4(position, 0.0, 1.0);
}
