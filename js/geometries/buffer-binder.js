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
    ["gl"],
    function (gl) {
        return {
            create: function (shader) {
                var bindings = [];

                return {
                    add: function (values, elementSize, attributeName) {
                        if (shader.attributes.hasOwnProperty(attributeName)) {
                            var buffer = gl.createBuffer();
                            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);
                            gl.bindBuffer(gl.ARRAY_BUFFER, null);

                            bindings.push({
                                buffer: buffer,
                                elementSize: elementSize,
                                attributeName: attributeName
                            });
                        } else {
                            console.warn("Attribute '" + attributeName + "' is supplied by asset, but is not supported by the specified shader");
                        }
                    },

                    bindAll: function () {
                        for (var i = 0; i < bindings.length; i++) {
                            var binding = bindings[i];
                            gl.bindBuffer(gl.ARRAY_BUFFER, binding.buffer);
                            gl.vertexAttribPointer(shader.attributes[binding.attributeName].index, binding.elementSize, gl.FLOAT, false, 0, 0);
                            gl.bindBuffer(gl.ARRAY_BUFFER, null);
                        }
                    }
                };
            }
        };
    }
);
