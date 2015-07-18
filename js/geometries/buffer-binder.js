/**
 * Copyright 2015 Wouter van Heeswijk
 */

define(
    ["gl"],
    function (gl) {
        return {
            create: function () {
                var bindings = [];

                return {
                    add: function (values, elementSize, attributeName) {
                        var buffer = gl.createBuffer();
                        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);
                        gl.bindBuffer(gl.ARRAY_BUFFER, null);

                        bindings.push({
                            buffer: buffer,
                            elementSize: elementSize,
                            attributeName: attributeName
                        });
                    },

                    bindAll: function (shaderInfo) {
                        for (var i = 0; i < bindings.length; i++) {
                            var binding = bindings[i];

                            if (shaderInfo.attributes.hasOwnProperty(binding.attributeName)) {
                                gl.bindBuffer(gl.ARRAY_BUFFER, binding.buffer);
                                gl.vertexAttribPointer(shaderInfo.attributes[binding.attributeName].index, binding.elementSize, gl.FLOAT, false, 0, 0);
                                gl.bindBuffer(gl.ARRAY_BUFFER, null);
                            } else {
                                // TODO: move check + warning to place where it is only called once (not every render)
                                console.warn("Vertices property is present in asset but is not supported by the specified shader");
                            }
                        }
                    }
                };
            }
        };
    }
);
