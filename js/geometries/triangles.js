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
                var trianglesCount = asset.count;
                var bindFunctions = [];

                // Flatten vertices and add draw function (if present)
                if (asset.hasOwnProperty("vertexSize")) {
                    var vertices = [].concat.apply([], asset.vertices.map(function (triangle) {
                        return [].concat.apply([], triangle);
                    }));

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

                // Flatten colors and add draw function (if present)
                if (asset.hasOwnProperty("colorSize")) {
                    var colors = [].concat.apply([], asset.colors.map(function (triangle) {
                        return [].concat.apply([], triangle);
                    }));

                    var colorBuffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
                    gl.bindBuffer(gl.ARRAY_BUFFER, null);

                    bindFunctions.push(function (shaderInfo) {
                        if (shaderInfo.attributes.hasOwnProperty("color")) {
                            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
                            gl.vertexAttribPointer(shaderInfo.attributes.color.index, asset.colorSize, gl.FLOAT, false, 0, 0);
                            gl.bindBuffer(gl.ARRAY_BUFFER, null);
                        } else {
                            console.warn("Colors property is present in asset but is not supported by the specified shader");
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

                        gl.drawArrays(gl.TRIANGLES, 0, trianglesCount * 3);
                    }
                };
            }
        };
    });
