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
    ["gl", "shaders/loader", "text!shaders/ray-marching.vertex.glsl", "text!shaders/ray-marching.fragment.glsl"],
    function (gl, loader, vertexShaderCode, fragmentShaderCode) {
        var program = loader.createProgram(vertexShaderCode, fragmentShaderCode);

        var attributePosition = gl.getAttribLocation(program, "position");
        var uniformProjection = gl.getUniformLocation(program, "projection");
        var uniformModelView = gl.getUniformLocation(program, "modelView");
        var uniformInverseModelView = gl.getUniformLocation(program, "inverseModelView");

        return {
            render: function (geometries) {
                if(this.uniforms.projection == null) {
                    throw new Error("Uniform not set: 'projection'");
                }

                if(this.uniforms.modelView == null) {
                    throw new Error("Uniform not set: 'modelView'");
                }

                if(this.uniforms.inverseModelView == null) {
                    throw new Error("Uniform not set: 'inverseModelView'");
                }

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
