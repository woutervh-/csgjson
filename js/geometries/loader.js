/**
 * Copyright 2015 Wouter van Heeswijk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
