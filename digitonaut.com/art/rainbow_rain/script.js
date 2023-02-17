var gl = c.getContext( 'experimental-webgl', { preserveDrawingBuffer: true } )
	,	w = c.width = window.innerWidth
	,	h = c.height = window.innerHeight

	,	opts = {
		dropWidth: .5,
		dropSpacing: 1,
		dropsParColumn: 3,
		dropBaseSpeed: .01,
		dropAddedSpeed: .005,
		dropAlpha: .6,
		dropRespawnChance: .1,
		acc: .1,
		tickSpeed: 1/360
	};

var webgl = {};
webgl.vertexShaderSource = `
attribute vec2 a_pos;
uniform vec2 u_res;
uniform vec2 u_params;
varying float hue;

void main(){
	gl_Position = vec4( vec2(1,-1) * ( ( ( a_pos + vec2(.5,0) ) / u_res ) * 2. - 1. ), 0, 1 );
	hue = u_params.y == 1. ? -1. : ( a_pos.x + a_pos.y * .1 ) / u_res.x + u_params.x;
}
`
webgl.fragmentShaderSource = `
precision mediump float;
varying float hue;

void main(){
	gl_FragColor = hue == -1. ? vec4( 0, 0, 0, .04 ) : vec4( clamp( abs( mod( hue * 6. + vec3( 0, 4, 2 ), 6. ) - 3. ) -1., 0., 1. ), ${opts.dropAlpha} );
}
`

webgl.vertexShader = gl.createShader( gl.VERTEX_SHADER );
gl.shaderSource( webgl.vertexShader, webgl.vertexShaderSource );
gl.compileShader( webgl.vertexShader );

webgl.fragmentShader = gl.createShader( gl.FRAGMENT_SHADER );
gl.shaderSource( webgl.fragmentShader, webgl.fragmentShaderSource );
gl.compileShader( webgl.fragmentShader );

webgl.shaderProgram = gl.createProgram();
gl.attachShader( webgl.shaderProgram, webgl.vertexShader );
gl.attachShader( webgl.shaderProgram, webgl.fragmentShader );

gl.linkProgram( webgl.shaderProgram );
gl.useProgram( webgl.shaderProgram );

webgl.posAttribLoc = gl.getAttribLocation( webgl.shaderProgram, 'a_pos' );
webgl.posBuffer = gl.createBuffer();

gl.enableVertexAttribArray( webgl.posAttribLoc );
gl.bindBuffer( gl.ARRAY_BUFFER, webgl.posBuffer );
gl.vertexAttribPointer( webgl.posAttribLoc, 2, gl.FLOAT, false, 0, 0 );

webgl.resUniformLoc = gl.getUniformLocation( webgl.shaderProgram, 'u_res' );
webgl.paramsUniformLoc = gl.getUniformLocation( webgl.shaderProgram, 'u_params' );

gl.viewport( 0, 0, w, h );
gl.uniform2f( webgl.resUniformLoc, w, h );

gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
gl.enable( gl.BLEND );

gl.lineWidth( opts.dropWidth );

webgl.posData = [];
webgl.clear = function(){
	webgl.posData = [
		0, 0,
		w, 0,
		0, h,
		0, h,
		w, 0,
		w, h
	];
	gl.uniform2f( webgl.paramsUniformLoc, 0, 1 );
	webgl.draw( gl.TRIANGLES );
	webgl.posData.length = 0;
}
webgl.draw = function( glType ){
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( webgl.posData ), gl.STATIC_DRAW );
	gl.drawArrays( glType, 0, webgl.posData.length / 2 );
}

function Drop( x ){
	this.x = x;
	this.reset();
	this.y = Math.random() * h;
}
Drop.prototype.reset = function(){
	this.y = 0;
	this.vy = opts.dropBaseSpeed + opts.dropAddedSpeed * Math.random();
}
Drop.prototype.step = function(){
	
	if( this.y > h ){
		if( Math.random() < opts.dropRespawnChance )
			return this.reset();
		else
			return 0;
	}
	
	var ny = this.y + ( this.vy += opts.acc );
	
	webgl.posData.push(
		this.x, this.y,
		this.x, ny
	);
	this.y = ny;
	
}
var drops = []
	,	tick = 0;

createDrops();

function createDrops(){
	drops.length = 0;
	
	for( var i = 0; i < w; i += opts.dropSpacing ){
		for( var j = 0; j < opts.dropsParColumn; ++j )
			drops.push( new Drop( i ) );
	}
}
function anim(){
	window.requestAnimationFrame( anim );
	tick += opts.tickSpeed;
	
	webgl.clear();
	gl.uniform2f( webgl.paramsUniformLoc, tick, 0 );
	
	drops.map( function( drop ){ drop.step(); } );
	
	webgl.draw( gl.LINES );
}
anim();

window.addEventListener( 'resize', function(){
	
	w = c.width = window.innerWidth;
	h = c.height = window.innerHeight;
	gl.viewport( 0, 0, w, h );
	gl.uniform2f( webgl.resUniformLoc, w, h );
	
	createDrops();
})