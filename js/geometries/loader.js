define(["geometries/triangles"], function (triangles) {
        return {
            load: function (asset) {
                try {
                    switch (asset.type) {
                        case "jr::geometry::triangles":
                            triangles.verify(asset);
                            return triangles.create(asset);
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
