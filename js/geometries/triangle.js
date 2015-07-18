define(["gl"], function (gl) {
    var buffer = gl.createBuffer();
    var vertices = [
        0.0, 1.0, 0.0,
        -1.0, -1.0, 0.0,
        1.0, -1.0, 0.0
    ];

    var itemSize = 3;
    var numItems = 3;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return {
        draw: function (shaderInfo) {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.vertexAttribPointer(shaderInfo.attributes.position.index, itemSize, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLES, 0, numItems);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
    };
});
