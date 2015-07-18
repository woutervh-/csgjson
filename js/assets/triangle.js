define(
    ["geometries/loader", "json!assets/triangle.json"],
    function (loader, asset) {
        return loader.load(asset);
    }
);
