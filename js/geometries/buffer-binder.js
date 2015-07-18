/**
 * Copyright 2015 Wouter van Heeswijk
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
