/**
 * Copyright 2015 Wouter van Heeswijk
 */

define(
    ["shaders/simple", "shaders/color", "shaders/csg"],
    function (simple, color, csg) {
        return {
            getByType: function (name) {
                switch (name) {
                    case "jr::shader::simple":
                        return simple;
                    case "jr::shader::color":
                        return color;
                    case "jr::shader::csg":
                        return csg;
                    default:
                        throw new Error("Could not find shader with name: '" + name + "'");
                }
            }
        };
    }
);
