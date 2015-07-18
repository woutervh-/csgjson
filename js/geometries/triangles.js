define(["gl"], function (gl) {
    return {
        verify: function (asset) {
            // Verify number of triangles
            var expectedTrianglesCount = asset.count;
            var actualTrianglesCount = asset.triangles.length;
            if (expectedTrianglesCount !== actualTrianglesCount) {
                throw new Error("Error creating triangles geometry: expected " + expectedTrianglesCount + " triangles but found " + actualTrianglesCount);
            }

            // Verify vertices
            var expectedVertexSize = asset.vertexSize;
            for (var i = 0; i < actualTrianglesCount; i++) {
                var triangle = asset.triangles[i];
                for (var j = 0; j < 3; j++) {
                    var vertex = triangle.vertices[j];
                    var actualVertexSize = vertex.length;

                    if (expectedVertexSize !== actualVertexSize) {
                        throw new Error("Error creating triangles geometry: expected vertex of size " + expectedVertexSize + " but was " + actualVertexSize);
                    }

                    for (var k = 0; k < actualVertexSize; k++) {
                        if (isNaN(vertex[k])) {
                            throw new Error("Error creating triangles geometry: expected number in vertex but found '" + vertex[k] + "'");
                        }
                    }
                }
            }

            // Verify colors
            var expectedColorSize = asset.colorSize;
            for (var i = 0; i < actualTrianglesCount; i++) {
                var triangle = asset.triangles[i];
                for (var j = 0; j < 3; j++) {
                    var color = triangle.colors[j];
                    var actualColorSize = color.length;

                    if (expectedColorSize !== actualColorSize) {
                        throw new Error("Error creating triangles geometry: expected color of size " + expectedColorSize + " but was " + actualColorSize);
                    }

                    for (var k = 0; k < actualColorSize; k++) {
                        if (isNaN(color[k])) {
                            throw new Error("Error creating triangles geometry: expected number in color but found '" + color[k] + "'");
                        }
                    }
                }
            }
        },

        create: function (asset) {
            // Configuration
            var trianglesCount = asset.count;
            var vertexSize = asset.vertexSize;
            var colorSize = asset.colorSize;

            // Flatten vertices and colors
            var vertices = [].concat.apply([], asset.triangles.map(function (triangle) {
                return [].concat.apply([], triangle.vertices);
            }));
            var colors = [].concat.apply([], asset.triangles.map(function (triangle) {
                return [].concat.apply([], triangle.colors);
            }));

            var vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            var colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            return {
                draw: function (shaderInfo) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
                    gl.vertexAttribPointer(shaderInfo.attributes.position.index, vertexSize, gl.FLOAT, false, 0, 0);
                    gl.bindBuffer(gl.ARRAY_BUFFER, null);

                    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
                    gl.vertexAttribPointer(shaderInfo.attributes.color.index, colorSize, gl.FLOAT, false, 0, 0);
                    gl.bindBuffer(gl.ARRAY_BUFFER, null);

                    gl.drawArrays(gl.TRIANGLES, 0, trianglesCount * 3);
                }
            };
        }
    };
});
