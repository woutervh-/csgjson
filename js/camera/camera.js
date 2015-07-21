/**
 * Copyright 2015 Wouter van Heeswijk
 */

define([], function () {
        var pitch = 0.0;
        var yaw = Math.PI;
        var eye = vec3.fromValues(0.0, 0.0, 0.0);
        var up = vec3.fromValues(0.0, 1.0, 0.0);
        
        var center = vec3.create();
        var viewMatrix = mat4.create();

        function updateCenter() {
            var sp = Math.sin(pitch);
            var cp = Math.cos(pitch);
            var sy = Math.sin(yaw);
            var cy = Math.cos(yaw);
            center[0] = eye[0] + -cp * sy;
            center[1] = eye[1] + sp;
            center[2] = eye[2] + cp * cy;
        }

        return {
            getEye: function () {
                return eye;
            },

            getCenter: function () {
                updateCenter();
                return center;
            },

            getUp: function () {
                return up;
            },

            getViewMatrix: function () {
                updateCenter();
                mat4.lookAt(viewMatrix, eye, center, up);
                return viewMatrix;
            },

            increasePitch: function (amount) {
                pitch += amount;
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
