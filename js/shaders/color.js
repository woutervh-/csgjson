/**
 * Copyright 2015 Wouter van Heeswijk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
