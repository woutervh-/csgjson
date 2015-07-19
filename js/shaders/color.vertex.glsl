/**
 * Copyright 2015 Wouter van Heeswijk
 */

attribute vec3 position;
attribute vec4 color;

uniform mat4 projection;
uniform mat4 modelView;

varying vec4 vColor;

void main() {
    vColor = color;
    gl_Position = projection * modelView * vec4(position, 1.0);
}
