/**
 * Copyright 2015 Wouter van Heeswijk
 */

#define PI 3.1415926535897932384626433832795
#define min_distance 0.1
#define max_distance 100.0

precision mediump float;

varying vec2 vPosition;
varying vec3 vEye;
varying vec3 vCenter;
varying vec3 vUp;
varying mat4 vProjection;
varying mat4 vModelView;

float sphere(vec3 ro, vec3 rd, vec3 sc, float sr) {
    float a = 1.0; // Assume rd is normalized
    float b = 2.0 * (dot(rd, ro - sc));
    float c = dot(ro - sc, ro - sc) - sr * sr;
    float discriminant = b * b - 4.0 * a * c;

    if(discriminant >= 0.0) {
        float t1 = (-b - sqrt(discriminant)) / (2.0 * a);
        float t2 = (-b + sqrt(discriminant)) / (2.0 * a);
        return min(t1, t2);
    }

    return max_distance;
}

float sphereDiffuse(vec3 ro, vec3 rd, vec3 sc, float t, vec3 lc) {
    vec3 intersection = ro + rd * t;
    vec3 normal = normalize(intersection - sc);
    vec3 ld = normalize(lc - intersection);
    return max(0.0, dot(normal, ld));
}

float plane(vec3 ro, vec3 rd, vec3 pc, vec3 pn) {
    float d1 = dot(rd, pn);
    float d2 = dot(pc - ro, pn);

    if(d1 < 0.0 && d2 < 0.0) {
        return d2 / d1;
    }

    return max_distance;
}

float planeDiffuse(vec3 ro, vec3 rd, float t, vec3 pn, vec3 lc) {
    vec3 intersection = ro + rd * t;
    vec3 ld = normalize(lc - intersection);
    return max(0.0, dot(pn, ld));
}

void main() {
    // Get focal length and aspect ratio from projection matrix
    float f = vProjection[1][1];
    float aspect = 1.0 / vProjection[0][0] * f;

    vec3 light = vec3(0.0, 1.0, 3.0);
    vec3 rayOrigin = vEye;
    // vec3 rayOrigin = vModelView[];
    vec3 rayDirection = normalize(vec3(vPosition * vec2(aspect, 1.0), -f)) * mat3(vModelView);

    vec3 sphereCenter = vec3(0.0, 0.0, -3.0);
    float sphereRadius = 1.0;
    float sphereT = clamp(sphere(rayOrigin, rayDirection, sphereCenter, sphereRadius), min_distance, max_distance);
    float sphereColor = sphereDiffuse(rayOrigin, rayDirection, sphereCenter, sphereT, light);

    vec3 planeCenter = vec3(0.0, 0.0, 0.0);
    vec3 planeNormal = vec3(0.0, 1.0, 0.0);
    float planeT = clamp(plane(rayOrigin, rayDirection, planeCenter, planeNormal), min_distance, max_distance);
    float planeColor = planeDiffuse(rayOrigin, rayDirection, planeT, planeNormal, light);

    if(planeT < min_distance && sphereT < min_distance) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }

    if(planeT < sphereT) {
        gl_FragColor = vec4(planeColor, planeColor, planeColor, 1.0);
    } else {
        gl_FragColor = vec4(sphereColor, sphereColor, sphereColor, 1.0);
    }
}
