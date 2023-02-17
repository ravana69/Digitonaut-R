var canvas = document.getElementById("canvas");
canvas.width = Math.min(window.innerWidth, window.innerHeight);
canvas.height = canvas.width;
var gl = canvas.getContext("webgl");

//Time
var dt = 0.004;
var time = 3.0;

//************** Shader sources **************
var vertexSource = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

var fragmentSource = `
#define PI 3.14159265358979323846
precision highp float;

uniform float width;
uniform float height;
vec2 resolution = vec2(width, height);
uniform float time;

vec2 rotate(vec2 _st, float _angle) {
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle), sin(_angle),cos(_angle)) * _st;
    _st.y += 0.5;
		_st.x += .5;
    return _st;
}

void main(){

	//set up positions and time
  vec2 uv = gl_FragCoord.xy/resolution.xy;
	float t = mod(time, 4.0*PI);
  t = t * sin(PI/5.0);
  vec2 pos = uv;
  pos = vec2(0.5, 0.5)-pos;

	//calculate distances and angles
  float d = length(pos);/*distance from center*/
	float id = 1.0 - d;/*inverse d, greater near the center*/
  float theta = -(atan(pos.y, pos.x));
	float rot = (2.0*PI*(id+1.0))*(t)+(6.0*theta);
   
	//rotate both positions
  pos = rotate(pos, -rot);
  uv = rotate(uv, -rot);

	//motion
  for(float i = 1.0; i < 12.0; i+=1.0){ 
			uv.x += .05*(cos(t+id+2.0*i)*uv.y*uv.x);
      uv += t+.05*(cos(t*.1)+sin(t)/d-3.0*i);
   }
	 
	//colors
  vec3 col = -d + 0.5*(cos(id-rot+pos.xyx+vec3(0,2,4)));
  vec3 col2 = id + 0.5*cos(id-cos(uv.xyx+vec3(0,2,4)));
  float arg = (d+rot+uv.x);
	vec3 col3 = mix(col, col2, cos(arg*4.0));
  col2 = id-col2;
  col3 *= col3;
  gl_FragColor = vec4(((col+col+col2/col3))/(col3-col-col2),1.0);
}
`;

//************** Utility functions **************

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
  canvas.width  = Math.min(window.innerWidth, window.innerHeight);
  canvas.height = canvas.width;
	gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform1f(widthHandle, canvas.width);
  gl.uniform1f(heightHandle, canvas.height);
}


//Compile shader and combine with source
function compileShader(shaderSource, shaderType) {
  var shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw "Shader compile failed with: " + gl.getShaderInfoLog(shader);
  }
  return shader;
}

//From https://codepen.io/jlfwong/pen/GqmroZ
//Utility to complain loudly if we fail to find the attribute/uniform
function getAttribLocation(program, name) {
  var attributeLocation = gl.getAttribLocation(program, name);
  if (attributeLocation === -1) {
    throw "Cannot find attribute " + name + ".";
  }
  return attributeLocation;
}

function getUniformLocation(program, name) {
  var attributeLocation = gl.getUniformLocation(program, name);
  if (attributeLocation === -1) {
    throw "Cannot find uniform " + name + ".";
  }
  return attributeLocation;
}

//************** Create shaders **************

//Create vertex and fragment shaders
var vertexShader = compileShader(vertexSource, gl.VERTEX_SHADER);
var fragmentShader = compileShader(fragmentSource, gl.FRAGMENT_SHADER);

//Create shader programs
var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

gl.useProgram(program);

//Set up rectangle covering entire canvas
var vertexData = new Float32Array([
  -1.0,
  1.0, // top left
  -1.0,
  -1.0, // bottom left
  1.0,
  1.0, // top right
  1.0,
  -1.0 // bottom right
]);

//Create vertex buffer
var vertexDataBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

// Layout of our data in the vertex buffer
var positionHandle = getAttribLocation(program, "position");

gl.enableVertexAttribArray(positionHandle);
gl.vertexAttribPointer(
  positionHandle,
  2, // position is a vec2 (2 values per component)
  gl.FLOAT, // each component is a float
  false, // don't normalize values
  2 * 4, // two 4 byte float components per vertex (32 bit float is 4 bytes)
  0 // how many bytes inside the buffer to start from
);

//Set uniform handle
var timeHandle = getUniformLocation(program, "time");
var widthHandle = getUniformLocation(program, "width");
var heightHandle = getUniformLocation(program, "height");

gl.uniform1f(widthHandle, canvas.width);
gl.uniform1f(heightHandle, canvas.height);

function draw() {
  //Update time
  time += dt;

  //Send uniforms to program
  gl.uniform1f(timeHandle, time);
  //Draw a triangle strip connecting vertices 0-4
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  requestAnimationFrame(draw);
}

draw();