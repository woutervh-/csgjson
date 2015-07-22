/**
 * Copyright 2015 Wouter van Heeswijk
 */

attribute vec2 position;

uniform mat4 projection;
uniform mat4 modelView;
uniform mat4 inverseModelView;

varying vec2 vPosition;
varying float vFocalLength;
varying float vAspectRatio;
varying vec3 vEye;
varying mat3 vModelView;

void main() {
    vPosition = position;

    // Get focal length and aspect ratio from projection matrix
    vFocalLength = projection[1][1];
    vAspectRatio = 1.0 / projection[0][0] * projection[1][1];

    // Get camera position from inverse model-view matrix
    vEye = inverseModelView[3].xyz;

    vModelView = mat3(modelView);

    gl_Position = vec4(vPosition, 0.0, 1.0);
}
