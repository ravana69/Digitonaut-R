// original demo:
// https://github.com/thi-ng/umbrella/tree/develop/examples/shader-ast-raymarch
// (c) 2019 Karsten Schmidt
//
// (please see various package readme's for further info/details)

import {
  $x,
  $xy,
  $xyz,
  assign,
  cos,
  defn,
  float,
  gte,
  ifThen,
  mix,
  mul,
  ret,
  sin,
  sym,
  vec2,
  vec3,
  vec4
} from "https://cdn.skypack.dev/@thi.ng/shader-ast@0.11.3";
import {
  clamp01,
  diffuseLighting,
  fit1101,
  fogExp2,
  halfLambert,
  lookat,
  raymarchAO,
  raymarchDir,
  raymarchNormal,
  raymarchScene,
  rayPointAt,
  sdfBox3,
  sdfRepeat3,
  sdfSphere,
  sdfSmoothUnionAll
} from "https://cdn.skypack.dev/@thi.ng/shader-ast-stdlib@0.10.3";
import { glCanvas } from "https://cdn.skypack.dev/@thi.ng/webgl@6.0.4";
import { shaderToy } from "https://cdn.skypack.dev/@thi.ng/webgl-shadertoy@0.3.4";

// shader function
// scene definition for raymarch function. uses SDF primitive functions
// included in shader-ast-stdlib pkg
const scene = defn("vec2", "scene", ["vec3"], (pos) => {
  return [
    // apply infinite spatial repetition
    assign(pos, sdfRepeat3(pos, vec3(2.1))),
    ret(
      vec2(
        // combine multiple shapes with smooth union op
        // the 4 shapes define a single 3D cross module
        // which is being repeated infinitely using the above op
        sdfSmoothUnionAll(
          float(0.2),
          sdfSphere(pos, float(0.5)),
          sdfBox3(pos, vec3(1, 0.2, 0.2)),
          sdfBox3(pos, vec3(0.2, 0.2, 1)),
          sdfBox3(pos, vec3(0.2, 1, 0.2))
        ),
        1
      )
    )
  ];
});

// main fragment shader function
// again uses several shader-ast-stdlib helpers
const mainImage = (gl, unis) => {
  let eyePos, dir, result, isec, norm, material, diffuse;
  // background/light colors
  const bg = vec3(1.5, 0.6, 0);
  const ambient = vec3(0.15, 0.06, 0);
  return [
    // set/compute camera position
    (eyePos = sym(
      vec3(
        mul(cos(unis.time), 2.5),
        mul(cos(mul(unis.time, float(0.5))), 0.7),
        mul(sin(unis.time), 2.5)
      )
    )),
    // compute ray dir from fragCoord, viewport res and FOV
    // then apply basic camera settings (eye, target, up)
    (dir = sym(
      $xyz(
        mul(
          lookat(eyePos, vec3(), vec3(0, 1, 0)),
          vec4(
            raymarchDir($xy(gl.gl_FragCoord), unis.resolution, float(120)),
            0
          )
        )
      )
    )),
    // perform raymarch
    // `raymarchScene` is a higher-order, configurable function which constructs
    // a raymarch function using our supplied scene fn
    (result = sym(
      raymarchScene(scene, { steps: 80, eps: 0.005 })(eyePos, dir)
    )),
    // early bailout if nothing hit
    ifThen(gte($x(result), float(10)), [ret(vec4(bg, 1))]),
    // set intersection pos
    (isec = sym(rayPointAt(eyePos, dir, $x(result)))),
    // surface normal
    (norm = sym(
      // higher-order fn to compute surface normal
      raymarchNormal(scene)(isec, float(0.01))
    )),
    // set material color
    (material = sym(fit1101(isec))),
    // compute diffuse term
    (diffuse = sym(
      mul(
        halfLambert(norm, unis.lightDir),
        // higher order fn to compute ambient occlusion
        raymarchAO(scene)(isec, norm)
      )
    )),
    // combine lighting & material colors
    ret(
      vec4(
        mix(
          clamp01(diffuseLighting(diffuse, material, vec3(1), ambient)),
          bg,
          fogExp2($x(result), float(0.2))
        ),
        1
      )
    )
  ];
};

// create WebGL canvas
const canvas = glCanvas({
  width: window.innerWidth,
  height: window.innerHeight,
  parent: document.body,
  version: 1
});

// init shader toy with canvas & shader fn
const toy = shaderToy({
  canvas: canvas.canvas,
  gl: canvas.gl,
  main: mainImage,
  uniforms: {
    lightDir: ["vec3", [0.707, 0.707, 0]]
  }
});

toy.start();