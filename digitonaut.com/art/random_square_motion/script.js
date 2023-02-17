var colors = "004777-a30000-ff7700-efd28d-00afb5-fff".split("-").map(a=>"#"+a)
class Particle{
	constructor(args){
		let def = {
			p: createVector(0,0),
			v: createVector(0,0),
			a: createVector(0,0),
			r: 8,
			color: color(255),
			lastP: createVector(0,0),
		}
		Object.assign(def,args)
		Object.assign(this,def)
	}
	draw(){
		push()
			// stroke(this.color)
			// line(this.p.x,this.p.y,this.lastP.x,this.lastP.y)
			translate(this.p.x,this.p.y)
			fill(this.color)
			ellipse(0,0,this.r,this.r)
		pop()
	}
	update(){
		this.lastP=this.p.copy()
		this.p.add(this.v)
		let angle = this.p.copy().sub(createVector(mouseX,mouseY)).heading()
		
		if (int(this.p.x)%15==0 && int(this.p.y)%15==0 ){
			this.v.x = random([-1,1])
			this.v.y = random([-1,1])
		}
// 		this.a.x += sin(this.p.x*2+angle/50)/20 + random(-0.01,0.01)/10
// 		this.a.y += cos(this.p.y*3+angle/50)/20 + random(-0.01,0.01)/10
	
		this.v.add(this.a)
		this.r*=0.99
	}
}
var particles = []
function setup() {
	createCanvas(windowWidth, windowHeight);
	background(200);
	pixelDensity(3)
	fill(0)
	rect(0,0,width,height)
	noStroke()
	
  drawingContext.shadowColor = color(50, 0, 0,30);
  drawingContext.shadowBlur =35;
	for(var i=0;i<1200;i++){
		particles.push(new Particle({
			p: createVector(width/2,height/2),
			v: createVector(cos(i)*2,sin(i)*2),
			r: random(20),
			
			color: random(colors)
			// a: createVector(sin(i)*0.1,cos(i)*0.1)
		}))
	}
}

function draw() {
	// background(0,1);
	particles.forEach(p=>{
		p.update()
		p.draw()
	})
	particles=particles.filter(p=>{
		return p.p.x>=0  &&  p.p.x<=width &&  p.p.y>=0  &&  p.p.y<=height && p.r>1
	})
	// ellipse(mouseX, mouseY, 20, 20);
}