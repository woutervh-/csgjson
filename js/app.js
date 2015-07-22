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
    ["gl", "assets/unit-square", "camera/camera", "camera/controller"],
    function (gl, asset, camera, controller) {
        var pMatrix = mat4.create();
        var mvMatrix = mat4.create();
        var imvMatrix = mat4.create();

        mat4.perspective(pMatrix, 45.0 / 180.0 * Math.PI, gl.canvas.width / gl.canvas.height, 0.1, 100.0);
        camera.increasePitch(-25.0 / 180.0 * Math.PI);
        camera.increaseYaw(45.0 / 180.0 * Math.PI);

        (function loop() {
            window.requestAnimationFrame(loop);
            controller.tick();

            mat4.identity(mvMatrix);
            mat4.multiply(mvMatrix, mvMatrix, camera.getViewMatrix());
            mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(3.0, -3.0, -3.0));
            mat4.invert(imvMatrix, mvMatrix);

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            // Render asset
            var shader = asset.shader;
            shader.uniforms.projection = pMatrix;
            shader.uniforms.modelView = mvMatrix;
            shader.uniforms.inverseModelView = imvMatrix;
            shader.render([asset]);
        })();

        if (gl.getError() != 0) {
            console.log("WebGL generated error code: " + gl.getError());
        }
    }
);
