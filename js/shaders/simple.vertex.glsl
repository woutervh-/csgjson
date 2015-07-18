attribute vec3 vertexPosition;

uniform mat4 mvMatrix;
uniform mat4 pMatrix;

void main() {
    gl_Position = pMatrix * mvMatrix * vec4(vertexPosition, 1.0);
}
