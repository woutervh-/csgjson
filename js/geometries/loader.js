/**
 * Copyright 2015 Wouter van Heeswijk
 */

define(
    ["geometries/triangles", "geometries/triangle-strip"],
    function (triangles, triangleStrip) {
        return {
            load: function (asset) {
                switch (asset.type) {
                    case "jr::geometry::triangles":
                        try {
                            triangles.verify(asset);
                        } catch (e) {
                            throw new Error("Verification of triangles asset failed: " + e.message);
                        }
                        return triangles.create(asset);
                    case "jr::geometry::triangle-strip":
                        try {
                            triangleStrip.verify(asset);
                        } catch (e) {
                            throw new Error("Verification of triangle-strip asset failed: " + e.message);
                        }
                        return triangleStrip.create(asset);
                    default:
                        throw new Error("Unsupported asset type: '" + asset.type + "'");
                }
            }
        };
    }
);
