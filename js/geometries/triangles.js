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
                    var actualTrianglesCount = asset.vertices.length;
                    if (expectedTrianglesCount !== actualTrianglesCount) {
                        throw new Error("Expected " + expectedTrianglesCount + " triangles in vertices property but found " + actualTrianglesCount);
                    }

                    var expectedVertexSize = asset.vertexSize;
                    for (var i = 0; i < actualTrianglesCount; i++) {
                        var triangle = asset.vertices[i];

                        if (triangle.length !== 3) {
                            throw new Error("Expected triangle with 3 vertices but found " + triangle.length + " vertices");
                        }

                        for (var j = 0; j < 3; j++) {
                            var vertex = triangle[j];
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
                }

                // Verify colors (if present)
                if (asset.hasOwnProperty("colorSize")) {
                    var actualTrianglesCount = asset.colors.length;
                    if (expectedTrianglesCount !== actualTrianglesCount) {
                        throw new Error("Expected " + expectedTrianglesCount + " triangles in colors property but found " + actualTrianglesCount);
                    }

                    var expectedColorSize = asset.colorSize;
                    for (var i = 0; i < actualTrianglesCount; i++) {
                        var triangle = asset.colors[i];

                        if (triangle.length !== 3) {
                            throw new Error("Expected triangle with 3 colors but found " + triangle.length + " colors");
                        }

                        for (var j = 0; j < 3; j++) {
                            var color = triangle[j];
                            var actualColorSize = color.length;

                            if (expectedColorSize !== actualColorSize) {
                                throw new Error("Expected color of size " + expectedColorSize + " but was " + actualColorSize);
                            }

                            for (var k = 0; k < actualColorSize; k++) {
                                if (isNaN(color[k])) {
                                    throw new Error("Expected number in color but found '" + color[k] + "'");
                                }
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
                    var vertices = [].concat.apply([], asset.vertices.map(function (triangle) {
                        return [].concat.apply([], triangle);
                    }));
                    binder.add(vertices, asset.vertexSize, "position");
                }

                // Flatten colors and add bind function (if present)
                if (asset.hasOwnProperty("colorSize")) {
                    var colors = [].concat.apply([], asset.colors.map(function (triangle) {
                        return [].concat.apply([], triangle);
                    }));
                    binder.add(colors, asset.colorSize, "color");
                }

                return {
                    shader: shader,

                    draw: function () {
                        binder.bindAll();
                        gl.drawArrays(gl.TRIANGLES, 0, trianglesCount * 3);
                    }
                };
            }
        };
    }
);
