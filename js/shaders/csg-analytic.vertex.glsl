/**
 * Copyright 2015 Wouter van Heeswijk
 */

#define PI 3.1415926535897932384626433832795

attribute vec2 position;

uniform mat4 projection;
uniform mat4 modelView;
uniform mat4 inverseModelView;

varying vec2 vPosition;
varying mat4 vProjection;
varying mat4 vModelView;
varying mat4 vInverseModelView;

void main() {
    vPosition = position;
    vProjection = projection;
    vModelView = modelView;
    vInverseModelView = inverseModelView;
    gl_Position = vec4(vPosition, 0.0, 1.0);
}
