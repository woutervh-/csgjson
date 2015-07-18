define(
    ["shaders/simple", "shaders/color"],
    function (simple, color) {
        return {
            getByName: function (name) {
                switch (name) {
                    case "jr::shader::simple":
                        return simple;
                    case "jr::shader::color":
                        return color;
                    default:
                        throw new Error("Could not find shader with name: '" + name + "'");
                }
            }
        };
    }
);
