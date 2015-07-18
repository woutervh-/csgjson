define(
    ["gl", "shaders/loader", "text!shaders/color.vertex.glsl", "text!shaders/color.fragment.glsl"],
    function (gl, loader, vertexShaderCode, fragmentShaderCode) {
        var program = loader.createProgram(vertexShaderCode, fragmentShaderCode);

        var attributePosition = gl.getAttribLocation(program, "position");
        var attributeColor = gl.getAttribLocation(program, "color");
        var uniformProjection = gl.getUniformLocation(program, "projection");
        var uniformModelView = gl.getUniformLocation(program, "modelView");

        return {
            render: function (geometries) {
                gl.useProgram(program);
                gl.enableVertexAttribArray(attributePosition);
                gl.enableVertexAttribArray(attributeColor);
                gl.uniformMatrix4fv(uniformProjection, false, this.uniforms.projection);
                gl.uniformMatrix4fv(uniformModelView, false, this.uniforms.modelView);

                for (var i = 0; i < geometries.length; i++) {
                    geometries[i].draw({
                        attributes: {
                            position: {
                                index: attributePosition
                            },
                            color: {
                                index: attributeColor
                            }
                        }
                    });
                }

                gl.useProgram(null);
            },

            uniforms: {
                projection: null,
                modelView: null
            }
        };
    }
);
