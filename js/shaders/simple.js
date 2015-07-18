define(
    ["gl", "shaders/loader", "text!shaders/simple.vertex.glsl", "text!shaders/simple.fragment.glsl"],
    function (gl, loader, vertexShaderCode, fragmentShaderCode) {
        var program = loader.load(vertexShaderCode, fragmentShaderCode);

        gl.useProgram(program);

        program.vertexPosition = gl.getAttribLocation(program, "vertexPosition");
        gl.enableVertexAttribArray(program.vertexPosition);

        program.pMatrix = gl.getUniformLocation(program, "pMatrix");
        program.mvMatrix = gl.getUniformLocation(program, "mvMatrix");

        return program;
    }
);
