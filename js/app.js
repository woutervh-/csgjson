define(["gl", "triangle", "shader"], function (gl, triangle, shader) {
    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();

    mat4.perspective(pMatrix, 45.0, gl.canvas.width / gl.canvas.height, 0.1, 100.0);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -7.0]);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(shader);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangle);
    gl.vertexAttribPointer(shader.vertexPosition, triangle.itemSize, gl.FLOAT, false, 0, 0);
    gl.uniformMatrix4fv(shader.pMatrix, false, pMatrix);
    gl.uniformMatrix4fv(shader.mvMatrix, false, mvMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, triangle.numItems);

    if (gl.getError() != 0) {
        console.log("WebGL generated error code: " + gl.getError());
    }
});
