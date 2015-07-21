/**
 * Copyright 2015 Wouter van Heeswijk
 */

define(
    ["gl", "assets/unit-square", "camera/camera", "camera/controller"],
    function (gl, asset, camera, controller) {
        var mvMatrix = mat4.create();
        var pMatrix = mat4.create();

        mat4.perspective(pMatrix, 45.0 / 180.0 * Math.PI, gl.canvas.width / gl.canvas.height, 0.1, 100.0);
        camera.forward(-3.0);
        camera.left(3.0);
        camera.up(3.0);
        camera.increasePitch(-25.0 / 180.0 * Math.PI);
        camera.increaseYaw(45.0 / 180.0 * Math.PI);

        (function loop() {
            window.requestAnimationFrame(loop);
            controller.tick();

            mat4.identity(mvMatrix);
            mat4.multiply(mvMatrix, mvMatrix, camera.getViewMatrix());
            mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(0.0, 0.0, -2.0));

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            // Render asset
            var shader = asset.shader;
            shader.uniforms.projection = pMatrix;
            shader.uniforms.modelView = mvMatrix;
            shader.uniforms.eye = camera.getEye();
            shader.uniforms.center = camera.getCenter();
            shader.uniforms.up = camera.getUp();
            shader.render([asset]);
        })();

        if (gl.getError() != 0) {
            console.log("WebGL generated error code: " + gl.getError());
        }
    }
);
