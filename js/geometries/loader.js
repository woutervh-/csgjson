/**
 * Copyright 2015 Wouter van Heeswijk
 */

define(
    ["geometries/triangles", "geometries/triangle-strip"],
    function (triangles, triangleStrip) {
        return {
            load: function (asset) {
                try {
                    switch (asset.type) {
                        case "jr::geometry::triangles":
                            triangles.verify(asset);
                            return triangles.create(asset);
                        case "jr::geometry::triangle-strip":
                            triangleStrip.verify(asset);
                            return triangleStrip.create(asset);
                        default:
                            throw new Error("Unsupported asset type: '" + asset.type + "'");
                    }
                } catch (e) {
                    throw new Error("Error occurred while trying to load asset: " + e.message);
                }
            }
        };
    }
);
