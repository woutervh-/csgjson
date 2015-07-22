/**
 * Copyright 2015 Wouter van Heeswijk
 */

#define min_distance 0.1
#define max_distance 2000.0
#define quality 500
#define accuracy 0.002

precision mediump float;

varying vec2 vPosition;
varying float vFocalLength;
varying float vAspectRatio;
varying vec3 vEye;
varying mat3 vModelView;

float plane(vec3 p, vec3 n) {
    return dot(p, n);
}

float sinePlane(vec3 p) {
    return p.y - sin(p.x) - cos(p.z);
}

float sphere(vec3 p, float r) {
    return length(p) - r;
}

float box(vec3 p, vec3 b) {
    vec3 d = abs(p) - b;
    return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

float opUnion(float d1, float d2) {
    return min(d1, d2);
}

float opIntersection(float d1, float d2) {
    return max(d1, d2);
}

float opComplement(float d1, float d2) {
    return max(d1, -d2);
}

float distance(vec3 p) {
    float o1 = sphere(p, 1.0);
    float o2 = box(p, vec3(0.75, 0.5, 1.0));
    return sinePlane(p);
    return opComplement(o1, o2);
}

vec3 normal(vec3 p) {
    vec3 delta = vec3(accuracy / 2.0, 0.0, 0.0);
    vec3 gradient = vec3(
        distance(p + delta.xyz) - distance(p - delta.xyz),
        distance(p + delta.zxy) - distance(p - delta.zxy),
        distance(p + delta.yzx) - distance(p - delta.yzx)
    );
    return normalize(gradient);
}

float diffuse(vec3 p, vec3 l, vec3 n) {
    vec3 d = normalize(l - p);
    return max(0.0, dot(n, d));
}

float specular(vec3 p, vec3 l, vec3 n, vec3 v, float shininess) {
    vec3 d = normalize(l - p);
    vec3 r = normalize(-reflect(d, n));
    return pow(max(0.0, -dot(v, r)), shininess);
}

void main() {
    vec3 light = vec3(1.0, 3.0, 2.0);
    vec3 rayOrigin = vEye;
    vec3 rayDirection = normalize(vec3(vPosition * vec2(vAspectRatio, 1.0), -vFocalLength)) * vModelView;

    float t = min_distance;
    for(int i=0; i<quality; i++) {
        t += distance(rayOrigin + rayDirection * t);

        if(t < accuracy || max_distance < t) {
            break;
        }
    }

    vec3 color = vec3(0.0, 0.0, 0.0);

    vec3 p = rayOrigin + rayDirection * t;
    vec3 n = normal(p);

    vec3 material = vec3(0.0);
    material += vec3(0.1, 0.2, 0.3); // Ambient
    material += vec3(0.5, 0.5, 0.5) * diffuse(p, light, n);
    material += vec3(0.5, 0.5, 0.5) * specular(p, light, n, rayDirection, 20.0);

    float mix = step(min_distance, t) * step(t, max_distance);
    color += mix * material;

    gl_FragColor = vec4(color, 1.0);
}
