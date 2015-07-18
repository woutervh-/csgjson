define(["gl"], function (gl) {
    return {
        create: function (asset) {
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

            // Flatten vertices and colors
            var vertices = [].concat.apply([], asset.triangles.map(function (triangle) {
                return [].concat.apply([], triangle.vertices);
            }));
            var colors = [].concat.apply([], asset.triangles.map(function (triangle) {
                return [].concat.apply([], triangle.colors);
            }));

            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            return {
                draw: function (shaderInfo) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                    gl.vertexAttribPointer(shaderInfo.attributes.position.index, expectedVertexSize, gl.FLOAT, false, 0, 0);
                    gl.drawArrays(gl.TRIANGLES, 0, actualTrianglesCount * 3);
                    gl.bindBuffer(gl.ARRAY_BUFFER, null);
                }
            };
        }
    };
});
