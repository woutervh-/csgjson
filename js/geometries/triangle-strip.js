/**
 * Copyright 2015 Wouter van Heeswijk
 */

define(
    ["gl", "shaders/manager"],
    function (gl, shaderManager) {
        return {
            verify: function (asset) {
                // For the verification of the number of triangles
                var expectedTrianglesCount = asset.count;

                // Verify vertices (if present)
                if (asset.hasOwnProperty("vertexSize")) {
                    var expectedVerticesCount = expectedTrianglesCount + 2;
                    var actualVerticesCount = asset.vertices.length;
                    if (expectedVerticesCount !== actualVerticesCount) {
                        throw new Error("Expected " + expectedVerticesCount + " vertices but found " + actualVerticesCount);
                    }

                    var expectedVertexSize = asset.vertexSize;
                    for (var i = 0; i < actualVerticesCount; i++) {
                        var vertex = asset.vertices[i];
                        var actualVertexSize = vertex.length;

                        if (expectedVertexSize !== actualVertexSize) {
                            throw new Error("Expected vertex of size " + expectedVertexSize + " but was " + actualVertexSize);
                        }

                        for (var k = 0; k < actualVertexSize; k++) {
                            if (isNaN(vertex[k])) {
                                throw new Error("Expected number in vertex but found '" + vertex[k] + "'");
                            }
                        }
                    }
                }
            },

            create: function (asset) {
                // Configuration
                var trianglesCount = asset.count;
                var bindFunctions = [];

                // Flatten vertices and add draw function (if present)
                if (asset.hasOwnProperty("vertexSize")) {
                    var vertices = [].concat.apply([], asset.vertices);

                    var vertexBuffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
                    gl.bindBuffer(gl.ARRAY_BUFFER, null);

                    bindFunctions.push(function (shaderInfo) {
                        if (shaderInfo.attributes.hasOwnProperty("position")) {
                            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
                            gl.vertexAttribPointer(shaderInfo.attributes.position.index, asset.vertexSize, gl.FLOAT, false, 0, 0);
                            gl.bindBuffer(gl.ARRAY_BUFFER, null);
                        } else {
                            console.warn("Vertices property is present in asset but is not supported by the specified shader");
                        }
                    });
                }

                return {
                    shader: shaderManager.getByName(asset.shader),

                    draw: function (shaderInfo) {
                        for (var i = 0; i < bindFunctions.length; i++) {
                            var bindFunction = bindFunctions[i];
                            bindFunction(shaderInfo);
                        }

                        gl.drawArrays(gl.TRIANGLE_STRIP, 0, trianglesCount + 2);
                    }
                };
            }
        };
    }
);
