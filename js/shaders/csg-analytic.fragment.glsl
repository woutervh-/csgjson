/**
 * Copyright 2015 Wouter van Heeswijk
 */

#define min_distance 0.1
#define max_distance 20.0

precision mediump float;

varying vec2 vPosition;
varying float vFocalLength;
varying float vAspectRatio;
varying vec3 vEye;
varying mat3 vModelView;

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

vec3 sphereNormal(vec3 intersection, vec3 sc) {
    return normalize(intersection - sc);
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

vec3 boxNormal(vec3 intersection, vec3 bmin, vec3 bmax) {
    vec3 bcenter = (bmin + bmax) / 2.0;
    vec3 normalDirection = intersection - bcenter;
    vec3 absoluteNormalDirection = abs(normalDirection);
    float extreme = max(absoluteNormalDirection.x, max(absoluteNormalDirection.y, absoluteNormalDirection.z));
    vec3 planeDirection = step(extreme, absoluteNormalDirection) * sign(normalDirection);
    return normalize(planeDirection);
}

float diffuse(vec3 intersection, vec3 light, vec3 normal) {
    vec3 direction = normalize(light - intersection);
    return max(0.0, dot(normal, direction));
}

void main() {
    vec3 light = vec3(1.0, 3.0, 2.0);
    vec3 rayOrigin = vEye;
    vec3 rayDirection = normalize(vec3(vPosition * vec2(vAspectRatio, 1.0), -vFocalLength)) * vModelView;

    vec3 boxMin = vec3(-1.0, -1.0, -1.0);
    vec3 boxMax = vec3(1.0, 1.0, 1.0);
    float boxT = box(rayOrigin, rayDirection, boxMin, boxMax);
    vec3 boxIntersection = rayOrigin + rayDirection * boxT;
    float boxDiffuse = diffuse(boxIntersection, light, boxNormal(boxIntersection, boxMin, boxMax));

    vec3 sphereCenter = vec3(0.0, 1.0, 0.0);
    float sphereRadius = 1.0;
    float sphereT = sphere(rayOrigin, rayDirection, sphereCenter, sphereRadius);
    vec3 sphereIntersection = rayOrigin + rayDirection * sphereT;
    float sphereDiffuse = diffuse(sphereIntersection, light, sphereNormal(sphereIntersection, sphereCenter));

    vec3 planeCenter = vec3(0.0, 0.0, 0.0);
    vec3 planeNorm = vec3(0.0, 1.0, 0.0);
    float planeT = plane(rayOrigin, rayDirection, planeCenter, planeNorm);
    vec3 planeIntersection = rayOrigin + rayDirection * planeT;
    float planeDiffuse = diffuse(planeIntersection, light, planeNormal(planeNorm));

    float minT = max_distance;
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);

    if(min_distance <= boxT && boxT <= minT) {
        minT = boxT;
        color.rgb = vec3(0.1, 0.2, 0.3);
        color.rgb += vec3(0.5, 0.5, 0.5) * vec3(boxDiffuse, boxDiffuse, boxDiffuse);
    }

    if(min_distance <= sphereT && sphereT <= minT) {
        minT = sphereT;
        color.rgb = vec3(0.3, 0.2, 0.1);
        color.rgb += vec3(0.5, 0.5, 0.5) * vec3(sphereDiffuse, sphereDiffuse, sphereDiffuse);
    }

    if(min_distance <= planeT && planeT <= minT) {
        minT = planeT;
        color.rgb = vec3(0.1, 0.3, 0.2);
        color.rgb += vec3(0.5, 0.5, 0.5) * vec3(planeDiffuse, planeDiffuse, planeDiffuse);
    }

    gl_FragColor = color;
}
