/**
 * Copyright 2015 Wouter van Heeswijk
 */

define(
    ["gl", "shaders/loader", "text!shaders/simple.vertex.glsl", "text!shaders/simple.fragment.glsl"],
    function (gl, loader, vertexShaderCode, fragmentShaderCode) {
        var program = loader.createProgram(vertexShaderCode, fragmentShaderCode);

        var attributePosition = gl.getAttribLocation(program, "position");
        var uniformProjection = gl.getUniformLocation(program, "projection");
        var uniformModelView = gl.getUniformLocation(program, "modelView");

        return {
            render: function (geometries) {
                gl.useProgram(program);
                gl.enableVertexAttribArray(attributePosition);
                gl.uniformMatrix4fv(uniformProjection, false, this.uniforms.projection);
                gl.uniformMatrix4fv(uniformModelView, false, this.uniforms.modelView);

                for (var i = 0; i < geometries.length; i++) {
                    geometries[i].draw();
                }

                gl.useProgram(null);
            },

            attributes: {
                position: {
                    index: attributePosition
                }
            },

            uniforms: {
                projection: null,
                modelView: null
            }
        };
    }
);
