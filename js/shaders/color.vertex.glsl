attribute vec3 position;
attribute vec4 color;

uniform mat4 projection;
uniform mat4 modelView;

varying vec4 vColor;

void main() {
    gl_Position = projection * modelView * vec4(position, 1.0);
    vColor = color;
}
