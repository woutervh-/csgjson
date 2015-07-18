define(["gl", "geometries/triangle", "shaders/simple"], function (gl, triangle, shader) {
    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();

    mat4.perspective(pMatrix, 45.0, gl.canvas.width / gl.canvas.height, 0.1, 100.0);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(0.0, 0.0, -7.0));

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    shader.use();
    shader.attributes.position.set(triangle);
    shader.uniforms.projection.set(pMatrix);
    shader.uniforms.modelView.set(mvMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangle);
    gl.drawArrays(gl.TRIANGLES, 0, triangle.numItems);

    if (gl.getError() != 0) {
        console.log("WebGL generated error code: " + gl.getError());
    }
});
