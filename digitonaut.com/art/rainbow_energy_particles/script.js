var w = c.width = window.innerWidth,
		h = c.height = window.innerHeight,
		ctx = c.getContext( '2d' ),
		
		opts = {
			
			orbits: 120,
			orbitTemplateColor: 'hsla(hue,80%,55%,.1)',
			orbitBaseVel: 1,
			orbitAddedVel: .5,
			orbitVelWaveIncrementer: .01,
			orbitRadIncrementer: .01,
			orbitAddedRad: .01,
			orbitAddedRadWaveIncrementer: .001,
			orbitSize: 20,
			orbitLines: 20
		},
		
		orbits = [],
		tick = 0;

ctx.fillStyle = '#181818';
ctx.fillRect( 0, 0, w, h );

function anim(){
	
	window.requestAnimationFrame( anim );
	
	++tick;
	
	if( orbits.length < opts.orbits && Math.random() < .1 )
		orbits.push( new Orbit );
	
	ctx.globalCompositeOperation = 'source-over';
	ctx.fillStyle = 'rgba(0,0,0,.02)';
	ctx.fillRect( 0, 0, w, h );
	
	ctx.globalCompositeOperation = 'lighter';
	orbits.map( function( orbit ){ orbit.step(); } );
}
function Orbit(){
	
	this.x = Math.random() * w;
	this.y = Math.random() * h;
	
	this.rad = Math.random() * Math.PI * 2;
	this.radWave = Math.random() * Math.PI * 2;
	this.velWave = Math.random() * Math.PI * 2;
}
Orbit.prototype.step = function(){
	
	this.rad += opts.orbitRadIncrementer + Math.random() * opts.orbitAddedRad * Math.sin( this.radWave += ( Math.random() * opts.orbitAddedRadWaveIncrementer ) );
	
	var len = opts.orbitBaseVel + opts.orbitAddedVel * Math.sin( this.velWave += opts.orbitVelWaveIncrementer ),
			vx = len * Math.cos( this.rad ),
			vy = len * Math.sin( this.rad ),
			revertX = true,
			revertY = true;
	
	this.x += vx;
	this.y += vy;
	
	if( this.x < 0 )
		this.x = 0;
	else if( this.x > w )
		this.x = w;
	else
		revertX = false;
	
	if( this.y < 0 )
		this.y = 0;
	else if( this.y > h )
		this.y = h;
	else
		revertY = false;
	
	if( revertX || revertY ){
		if( revertX )
			vx *= -1;
		if( revertY )
			vy *= -1;
		
		this.rad = Math.atan( vy/vx ) + ( vx < 0 ? Math.PI : 0 );
	}
	
	ctx.strokeStyle = opts.orbitTemplateColor.replace( 'hue', this.x / w * 360 + tick );
	ctx.beginPath();
	for( var i = 0; i < opts.orbitLines; ++i ){
		
		var len = ( 1 - Math.sqrt( Math.random() ) ) * opts.orbitSize,
				rad = Math.random() * Math.PI * 2;
		
		ctx.moveTo( this.x + len * Math.cos( rad ), this.y + len * Math.sin( rad ) );
		ctx.lineTo( this.x, this.y );
	}
	ctx.stroke();
}
anim();

window.addEventListener( 'resize', function(){
	
	w = c.width = window.innerWidth;
	h = c.height = window.innerHeight;
	
	ctx.fillStyle = '#181818';
	ctx.fillRect( 0, 0, w, h );
});
window.addEventListener( 'click', function( e ){
	
	var orb = new Orbit();
	orb.x = e.clientX;
	orb.y = e.clientY;
	orbits.push( orb );
})