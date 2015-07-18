define(["gl"], function (gl) {
        return {
            createProgram: function (vertexShaderCode, fragmentShaderCode) {
                var vertexShader = gl.createShader(gl.VERTEX_SHADER);
                gl.shaderSource(vertexShader, vertexShaderCode);
                gl.compileShader(vertexShader);

                if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
                    throw new Error("Could not compile vertex shader: " + gl.getShaderInfoLog(vertexShader));
                }

                var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
                gl.shaderSource(fragmentShader, fragmentShaderCode);
                gl.compileShader(fragmentShader);

                if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
                    throw new Error("Could not compile fragment shader: " + gl.getShaderInfoLog(fragmentShader));
                }

                var shaderProgram = gl.createProgram();
                gl.attachShader(shaderProgram, vertexShader);
                gl.attachShader(shaderProgram, fragmentShader);
                gl.linkProgram(shaderProgram);

                if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                    throw new Error("Could not link shaders: " + gl.getProgramInfoLog(shaderProgram));
                }

                return shaderProgram;
            }
        };
    }
);
