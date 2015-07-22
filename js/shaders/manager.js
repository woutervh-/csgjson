/**
 * Copyright 2015 Wouter van Heeswijk
 */

define(
    ["shaders/simple", "shaders/color", "shaders/ray-tracing", "shaders/ray-marching"],
    function (simple, color, rayTracing, rayMarching) {
        return {
            getByType: function (name) {
                switch (name) {
                    case "jr::shader::simple":
                        return simple;
                    case "jr::shader::color":
                        return color;
                    case "jr::shader::ray-tracing":
                        return rayTracing;
                    case "jr::shader::ray-marching":
                        return rayMarching;
                    default:
                        throw new Error("Could not find shader with name: '" + name + "'");
                }
            }
        };
    }
);
