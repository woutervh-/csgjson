/**
 * Copyright 2015 Wouter van Heeswijk
 */

define(
    ["gl", "shaders/loader", "text!shaders/csg-analytic.vertex.glsl", "text!shaders/csg-analytic.fragment.glsl"],
    function (gl, loader, vertexShaderCode, fragmentShaderCode) {
        var program = loader.createProgram(vertexShaderCode, fragmentShaderCode);

        var attributePosition = gl.getAttribLocation(program, "position");
        var uniformProjection = gl.getUniformLocation(program, "projection");
        var uniformModelView = gl.getUniformLocation(program, "modelView");
        var uniformInverseModelView = gl.getUniformLocation(program, "inverseModelView");

        return {
            render: function (geometries) {
                gl.useProgram(program);
                gl.enableVertexAttribArray(attributePosition);
                gl.uniformMatrix4fv(uniformProjection, false, this.uniforms.projection);
                gl.uniformMatrix4fv(uniformModelView, false, this.uniforms.modelView);
                gl.uniformMatrix4fv(uniformInverseModelView, false, this.uniforms.inverseModelView);

                for (var i = 0; i < geometries.length; i++) {
                    geometries[i].draw();
                }

                gl.disableVertexAttribArray(attributePosition);
                gl.useProgram(null);
            },

            attributes: {
                position: {
                    index: attributePosition
                }
            },

            uniforms: {
                projection: null,
                modelView: null,
                inverseModelView: null
            }
        };
    }
);
