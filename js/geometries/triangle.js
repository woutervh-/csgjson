define(
    ["gl", "geometries/triangles", "json!../../assets/triangle.json"],
    function (gl, triangles, asset) {
        return triangles.create(asset);
    }
);
