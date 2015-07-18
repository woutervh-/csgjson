define(
    ["gl", "shaders/loader", "text!shaders/simple.vertex.glsl", "text!shaders/simple.fragment.glsl"],
    function (gl, loader, vertexShaderCode, fragmentShaderCode) {
        var program = loader.load(vertexShaderCode, fragmentShaderCode);

        var attributePosition = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(attributePosition);

        var uniformProjection = gl.getUniformLocation(program, "projection");
        var uniformModelView = gl.getUniformLocation(program, "modelView");

        return {
            use: function () {
                gl.useProgram(program);
            },

            attributes: {
                position: {
                    set: function (geometry) {
                        gl.vertexAttribPointer(attributePosition, geometry.itemSize, gl.FLOAT, false, 0, 0);
                    }
                }
            },

            uniforms: {
                projection: {
                    set: function (projectionMatrix) {
                        gl.uniformMatrix4fv(uniformProjection, false, projectionMatrix);
                    }
                },
                modelView: {
                    set: function (modelViewMatrix) {
                        gl.uniformMatrix4fv(uniformModelView, false, modelViewMatrix);
                    }
                }
            }
        };
    }
);
