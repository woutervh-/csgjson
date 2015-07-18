/**
 * Copyright 2015 Wouter van Heeswijk
 */

define(
    ["gl", "assets/triangle-strip"],
    function (gl, asset) {
        var mvMatrix = mat4.create();
        var pMatrix = mat4.create();

        mat4.perspective(pMatrix, 45.0, gl.canvas.width / gl.canvas.height, 0.1, 100.0);
        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(0.0, 0.0, -7.0));

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Render asset
        var shader = asset.shader;
        shader.uniforms.projection = pMatrix;
        shader.uniforms.modelView = mvMatrix;
        shader.render([asset]);

        if (gl.getError() != 0) {
            console.log("WebGL generated error code: " + gl.getError());
        }
    }
);
