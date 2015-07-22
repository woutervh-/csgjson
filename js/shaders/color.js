/**
 * Copyright 2015 Wouter van Heeswijk
 */

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
                if(this.uniforms.projection == null) {
                    throw new Error("Uniform not set: 'projection'");
                }

                if(this.uniforms.modelView == null) {
                    throw new Error("Uniform not set: 'modelView'");
                }

                gl.useProgram(program);
                gl.enableVertexAttribArray(attributePosition);
                gl.enableVertexAttribArray(attributeColor);
                gl.uniformMatrix4fv(uniformProjection, false, this.uniforms.projection);
                gl.uniformMatrix4fv(uniformModelView, false, this.uniforms.modelView);

                for (var i = 0; i < geometries.length; i++) {
                    geometries[i].draw();
                }

                gl.disableVertexAttribArray(attributePosition);
                gl.disableVertexAttribArray(attributeColor);
                gl.useProgram(null);
            },

            attributes: {
                position: {
                    index: attributePosition
                },
                color: {
                    index: attributeColor
                }
            },

            uniforms: {
                projection: null,
                modelView: null
            }
        };
    }
);
