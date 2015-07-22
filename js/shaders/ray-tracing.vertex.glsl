/**
 * Copyright 2015 Wouter van Heeswijk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
