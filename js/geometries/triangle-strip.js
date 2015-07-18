/**
 * Copyright 2015 Wouter van Heeswijk
 */

define(
    ["gl", "shaders/manager", "geometries/buffer-binder"],
    function (gl, shaderManager, bufferBinder) {
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
                var shader = shaderManager.getByName(asset.shader);
                var trianglesCount = asset.count;
                var binder = bufferBinder.create(shader);

                // Flatten vertices and add bind function (if present)
                if (asset.hasOwnProperty("vertexSize")) {
                    var vertices = [].concat.apply([], asset.vertices);
                    binder.add(vertices, asset.vertexSize, "position");
                }

                return {
                    shader: shader,

                    draw: function () {
                        binder.bindAll();
                        gl.drawArrays(gl.TRIANGLE_STRIP, 0, trianglesCount + 2);
                    }
                };
            }
        };
    }
);
