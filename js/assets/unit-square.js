/**
 * Copyright 2015 Wouter van Heeswijk
 */

define(
    ["geometries/loader", "json!assets/unit-square.json"],
    function (loader, asset) {
        return loader.load(asset);
    }
);
