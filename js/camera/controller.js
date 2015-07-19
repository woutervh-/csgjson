/**
 * Copyright 2015 Wouter van Heeswijk
 */

define(
    ["canvas", "camera/camera"],
    function (canvas, camera) {
        var oldX = -1;
        var oldY = -1;
        var mouseDown = false;
        var keys = {
            "W": false,
            "A": false,
            "S": false,
            "D": false,
            "Q": false,
            "E": false
        };

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

        canvas.addEventListener("keydown", function (event) {
            keys[String.fromCharCode(event.keyCode)] = true;
        });

        canvas.addEventListener("keyup", function (event) {
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
                    camera.forward(0.05);
                }
                if (keys["S"]) {
                    camera.forward(-0.05);
                }
                if (keys["A"]) {
                    camera.left(0.05);
                }
                if (keys["D"]) {
                    camera.left(-0.05);
                }
                if (keys["Q"]) {
                    camera.up(0.05);
                }
                if (keys["E"]) {
                    camera.up(-0.05);
                }
            }
        };
    }
);
