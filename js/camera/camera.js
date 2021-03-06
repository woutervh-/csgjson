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

define([], function () {
        var pitch = 0.0;
        var yaw = Math.PI;
        var eye = vec3.fromValues(0.0, 0.0, 0.0);
        var up = vec3.fromValues(0.0, 1.0, 0.0);

        var center = vec3.create();
        var viewMatrix = mat4.create();

        return {
            getViewMatrix: function () {
                var sp = Math.sin(pitch);
                var cp = Math.cos(pitch);
                var sy = Math.sin(yaw);
                var cy = Math.cos(yaw);
                center[0] = eye[0] + -cp * sy;
                center[1] = eye[1] + sp;
                center[2] = eye[2] + cp * cy;
                mat4.lookAt(viewMatrix, eye, center, up);
                return viewMatrix;
            },

            increasePitch: function (amount) {
                pitch += amount;
                pitch = Math.min(Math.max(pitch, -Math.PI / 2.0 + 0.01), Math.PI / 2.0 - 0.01);
            },

            increaseYaw: function (amount) {
                yaw += amount;
            },

            forward: function (amount) {
                var sp = Math.sin(pitch);
                var cp = Math.cos(pitch);
                var sy = Math.sin(yaw);
                var cy = Math.cos(yaw);
                eye[0] += amount * -cp * sy;
                eye[1] += amount * sp;
                eye[2] += amount * cp * cy;
            },

            left: function (amount) {
                eye[0] += amount * Math.cos(yaw);
                eye[2] += amount * Math.sin(yaw);
            },

            up: function (amount) {
                eye[1] += amount;
            }
        };
    }
);
