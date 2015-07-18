define(["geometries/triangles"], function (triangles) {
        return {
            load: function (asset) {
                switch (asset.type) {
                    case "jr::geometry::triangles":
                        triangles.verify(asset);
                        return triangles.create(asset);
                    default:
                        throw new Error("Unsupported asset type: '" + asset.type + "'");
                }
            }
        };
    }
);
