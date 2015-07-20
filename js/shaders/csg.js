/**
 * Copyright 2015 Wouter van Heeswijk
 */

define(
    ["gl", "shaders/loader", "text!shaders/csg.vertex.glsl", "text!shaders/csg.fragment.glsl"],
    function (gl, loader, vertexShaderCode, fragmentShaderCode) {
        var program = loader.createProgram(vertexShaderCode, fragmentShaderCode);

        var attributePosition = gl.getAttribLocation(program, "position");
        var uniformEye = gl.getUniformLocation(program, "eye");
        var uniformCenter = gl.getUniformLocation(program, "center");
        var uniformUp = gl.getUniformLocation(program, "up");
        var uniformProjection = gl.getUniformLocation(program, "projection");
        var uniformModelView = gl.getUniformLocation(program, "modelView");

        return {
            render: function (geometries) {
                gl.useProgram(program);
                gl.enableVertexAttribArray(attributePosition);
                gl.uniform3fv(uniformEye, this.uniforms.eye);
                gl.uniform3fv(uniformCenter, this.uniforms.center);
                gl.uniform3fv(uniformUp, this.uniforms.up);
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
                eye: null,
                center: null,
                up: null,
                projection: null,
                modelView: null
            }
        };
    }
);
