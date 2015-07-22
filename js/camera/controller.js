/**
 * Copyright 2015 Wouter van Heeswijk
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
