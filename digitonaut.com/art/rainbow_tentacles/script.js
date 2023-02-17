var w = c.width = window.innerWidth,
    h = c.height = window.innerHeight,
    ctx = c.getContext( '2d' ),
    
    opts = {
      
      tickSpeed: .5,
      squareDist: 4000,
      particleCount: 5,
      
      connectionLife: 20,
      connectionSplitsMultiplier: .2, // multiplier referring to life of connection
      connectionJitterMultiplier: .4,
      connectionSpacing: 25,
      
      particleBaseVel: 2,
      particleAddedVel: 4,
      particleBounceBaseMultiplier: -1.2,
      particleBounceAddedMultiplier: .4,
    },
    
    tick = ( Math.random() * 360 ) |0,
    particles = [],
    points = [];

function init() {
  
  particles.length = 0;
  points.length = 0;
  
  for( var i = 0; i < opts.particleCount; ++i )
    particles.push( new Particle );
  
  for( var x = 0; x < w; x += opts.connectionSpacing )
    for( var y = 0; y < h; y += opts.connectionSpacing )
      points.push( new Point( x, y ) );
  
}
function loop() {
  
  window.requestAnimationFrame( loop );
  
  tick += opts.tickSpeed;
  
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(0,0,0,.5)';
  ctx.fillRect( 0, 0, w, h );
  ctx.globalCompositeOperation = 'lighter';
  
  points.map( function( point ) { point.step(); } );
  particles.map( function( particle ) { particle.step(); } );
}

function Point( x, y ) {
  
  this.x = x;
  this.y = y;
  
  this.resets = 0;
}
Point.prototype.step = function() {
  
  this.y += opts.tickSpeed;
  
  if( this.y > h ) {
    
    ++this.resets;
    this.y = 0;
  }
  
  ctx.fillStyle = '#111';
  ctx.fillRect( this.x, this.y, 2, 2 );
}

function Particle() {
  
  this.x = Math.random() * w;
  this.y = Math.random() * h;
  
  var vel = opts.particleBaseVel + Math.random() * opts.particleAddedVel,
      rad = Math.random() * Math.PI * 2;
  
  this.vx = Math.cos( rad ) * vel;
  this.vy = Math.sin( rad ) * vel;
  
  this.connections = [];
  this.connectionLives = [];
  this.connectionResets = [];
}
Particle.prototype.step = function() {
  
  // basic physics and bounces
  this.x += this.vx;
  this.y += this.vy;
  
  if( this.x < 0 || this.x > w )
    this.vx *= opts.particleBounceBaseMultiplier + Math.random() * opts.particleBounceAddedMultiplier;
  
  if( this.y < 0 || this.y > h )
    this.vy *= opts.particleBounceBaseMultiplier + Math.random() * opts.particleBounceAddedMultiplier;
  
  // create connections
  // crazily inefficient, but I'm crazily lazy... so... :P
  for( var i = 0; i < points.length; ++i ) {
    
    var point = points[ i ],
        dx = point.x - this.x,
        dy = point.y - this.y;
    
    if( dx*dx + dy*dy < opts.squareDist ) {
      
      var index = this.connections.indexOf( point );
      
      if( index === -1 ) {
        
        this.connections.push( point );
        this.connectionLives.push( opts.connectionLife );
        this.connectionResets.push( point.resets );
        
      } else {
        
        this.connectionLives[ index ] = opts.connectionLife;
      }
    }
  }
  
  // delete connections
  for( var i = 0; i < this.connectionLives.length; ++i ) {
    
    --this.connectionLives[ i ];
    
    // check if too much time has passed or the point has gone to top
    if( this.connectionLives[ i ] < 0 ||
       this.connectionResets[ i ] !== this.connections[ i ].resets ){
      
      this.connectionLives.splice( i, 1 );
      this.connections.splice( i, 1 );
      this.connectionResets.splice( i, 1 );
      --i;
    }
  }
  
  // rendering
  
  for( var i = 0; i < this.connections.length; ++i ) {
    // could have done this in the connection deleter loop, but for the sake of almost-modularization...
    
    // lazy variable naming. I know. Don't blame me, it's 34°C in here :P
    var point = this.connections[ i ],
        life = this.connectionLives[ i ],
        splits = ( opts.connectionSplitsMultiplier * life ) |0,
        jitter = opts.connectionJitterMultiplier * life,
        dx = this.x - point.x,
        dy = this.y - point.y,
        sdx = dx / splits, // split version of dx
        sdy = dy / splits,
        lw = ( life / opts.connectionLife ) * 3, // lineWidth
        slw = lw / splits, // split version of lw
        
        x = point.x + Math.random() * jitter,
        y = point.y + Math.random() * jitter;
    
    for( var j = 0; j < splits; ++j ){
      
      ctx.beginPath();
      ctx.lineWidth = slw * j;
      ctx.strokeStyle = 'hsl(hue,80%,50%)'.replace( 'hue', y / h * 360 + tick );
      ctx.moveTo( x, y );
      
      x = point.x + sdx * j + Math.random() * jitter;
      y = point.y + sdy * j + Math.random() * jitter;
      
      ctx.lineTo( x, y );
      ctx.stroke();
    }
  }
}
init();
loop();

window.addEventListener( 'resize', function(){
  
  w = c.width = window.innerWidth;
  h = c.height = window.innerHeight;
  init();
} )