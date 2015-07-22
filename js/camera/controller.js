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

define(
    ["canvas", "camera/camera"],
    function (canvas, camera) {
        var speed = 0.05;
        var oldX = -1;
        var oldY = -1;
        var mouseDown = false;
        var keys = {
            "W": false,
            "S": false,
            "A": false,
            "D": false,
            "Q": false,
            "E": false
        };

        canvas.addEventListener("wheel", function (event) {
            if(event.wheelDelta > 0) {
                speed *= 1.1;
            } else {
                speed /= 1.1;
            }
        });

        canvas.addEventListener("mousemove", function (event) {
            var x = event.clientX;
            var y = event.clientY;

            if (oldX === -1 || oldY === -1) {
                oldX = x;
                oldY = y;
            }

            var dx = x - oldX;
            var dy = oldY - y;
            oldX = x;
            oldY = y;

            if (mouseDown) {
                camera.increasePitch(0.005 * dy);
                camera.increaseYaw(0.005 * dx);
            }
        });

        document.addEventListener("keydown", function (event) {
            keys[String.fromCharCode(event.keyCode)] = true;
        });

        document.addEventListener("keyup", function (event) {
            keys[String.fromCharCode(event.keyCode)] = false;
        });

        canvas.addEventListener("mousedown", function () {
            mouseDown = true;
        });

        canvas.addEventListener("mouseup", function () {
            mouseDown = false;
        });

        return {
            tick: function () {
                if (keys["W"]) {
                    camera.forward(speed);
                }
                if (keys["S"]) {
                    camera.forward(-speed);
                }
                if (keys["A"]) {
                    camera.left(speed);
                }
                if (keys["D"]) {
                    camera.left(-speed);
                }
                if (keys["Q"]) {
                    camera.up(speed);
                }
                if (keys["E"]) {
                    camera.up(-speed);
                }
            }
        };
    }
);
