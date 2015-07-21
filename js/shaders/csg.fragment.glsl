/**
 * Copyright 2015 Wouter van Heeswijk
 */

#define PI 3.1415926535897932384626433832795
#define min_distance 0.1
#define max_distance 20.0

precision mediump float;

varying vec2 vPosition;
varying vec3 vEye;
varying vec3 vCenter;
varying vec3 vUp;
varying mat4 vProjection;
varying mat4 vModelView;

float sphere(vec3 ro, vec3 rd, vec3 sc, float sr) {
    // Assume rd is normalized
    float a = 1.0;
    float b = 2.0 * (dot(rd, ro - sc));
    float c = dot(ro - sc, ro - sc) - sr * sr;
    float discriminant = b * b - 4.0 * a * c;
    // Don't check discriminant sign to avoid branches - just let it happen
    float t1 = (-b - sqrt(discriminant)) / (2.0 * a);
    float t2 = (-b + sqrt(discriminant)) / (2.0 * a);
    return min(t1, t2);
}

vec3 sphereNormal(vec3 ro, vec3 rd, vec3 sc, float t) {
    return normalize(ro + rd * t - sc);
}

float plane(vec3 ro, vec3 rd, vec3 pc, vec3 pn) {
    float d1 = dot(rd, pn);
    float d2 = dot(pc - ro, pn);
    return d2 / d1 * step(d1, 0.0) * step(d2, 0.0);
}

vec3 planeNormal(vec3 pn) {
    return pn;
}

float box(vec3 ro, vec3 rd, vec3 bmin, vec3 bmax) {
    float tx1 = (bmin.x - ro.x) / rd.x;
    float tx2 = (bmax.x - ro.x) / rd.x;
    float tmin = min(tx1, tx2);
    float tmax = max(tx1, tx2);

    float ty1 = (bmin.y - ro.y) / rd.y;
    float ty2 = (bmax.y - ro.y) / rd.y;
    tmin = max(tmin, min(ty1, ty2));
    tmax = min(tmax, max(ty1, ty2));

    float tz1 = (bmin.z - ro.z) / rd.z;
    float tz2 = (bmax.z - ro.z) / rd.z;
    tmin = max(tmin, min(tz1, tz2));
    tmax = min(tmax, max(tz1, tz2));

    return tmin * step(tmin, tmax);
}

vec3 boxNormal(vec3 ro, vec3 rd, float t, vec3 bmin, vec3 bmax) {
    vec3 intersection = ro + rd * t;
    vec3 bcenter = (bmin + bmax) / 2.0;
    vec3 normalDirection = intersection - bcenter;
    vec3 absoluteNormalDirection = abs(normalDirection);
    float extreme = max(absoluteNormalDirection.x, max(absoluteNormalDirection.y, absoluteNormalDirection.z));
    vec3 planeDirection = step(extreme, absoluteNormalDirection) * sign(normalDirection);
    return normalize(planeDirection);
}

float diffuse(vec3 ro, vec3 rd, float t, vec3 light, vec3 normal) {
    vec3 intersection = ro + rd * t;
    vec3 direction = normalize(light - intersection);
    return max(0.0, dot(normal, direction));
}

void main() {
    // Get focal length and aspect ratio from projection matrix
    float f = vProjection[1][1];
    float aspect = 1.0 / vProjection[0][0] * f;

    vec3 light = vec3(1.0, 3.0, 2.0);
    vec3 rayOrigin = vEye;
    // vec3 rayOrigin = vModelView[];
    vec3 rayDirection = normalize(vec3(vPosition * vec2(aspect, 1.0), -f)) * mat3(vModelView);

    vec3 boxMin = vec3(-1.0, -1.0, -1.0);
    vec3 boxMax = vec3(1.0, 1.0, 1.0);
    float boxT = box(rayOrigin, rayDirection, boxMin, boxMax);
    float boxDiffuse = diffuse(rayOrigin, rayDirection, boxT, light, boxNormal(rayOrigin, rayDirection, boxT, boxMin, boxMax));

    vec3 sphereCenter = vec3(0.0, 1.0, 0.0);
    float sphereRadius = 1.0;
    float sphereT = sphere(rayOrigin, rayDirection, sphereCenter, sphereRadius);
    float sphereDiffuse = diffuse(rayOrigin, rayDirection, sphereT, light, sphereNormal(rayOrigin, rayDirection, sphereCenter, sphereT));

    vec3 planeCenter = vec3(0.0, 0.0, 0.0);
    vec3 planeNorm = vec3(0.0, 1.0, 0.0);
    float planeT = plane(rayOrigin, rayDirection, planeCenter, planeNorm);
    float planeDiffuse = diffuse(rayOrigin, rayDirection, planeT, light, planeNormal(planeNorm));

    float min = max_distance;
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);

    if(min_distance <= boxT && boxT <= min) {
        min = boxT;
        color.rgb = vec3(0.1, 0.2, 0.3);
        color.rgb += vec3(0.5, 0.5, 0.5) * vec3(boxDiffuse, boxDiffuse, boxDiffuse);
    }

    if(min_distance <= sphereT && sphereT <= min) {
        min = sphereT;
        color.rgb = vec3(0.3, 0.2, 0.1);
        color.rgb += vec3(0.5, 0.5, 0.5) * vec3(sphereDiffuse, sphereDiffuse, sphereDiffuse);
    }

    if(min_distance <= planeT && planeT <= min) {
        min = planeT;
        color.rgb = vec3(0.1, 0.3, 0.2);
        color.rgb += vec3(0.5, 0.5, 0.5) * vec3(planeDiffuse, planeDiffuse, planeDiffuse);
    }

    gl_FragColor = color;
}
