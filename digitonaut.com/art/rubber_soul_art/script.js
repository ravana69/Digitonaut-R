// By Roni Kaufman
// Inspired by Jackson Pollock's paintings

let colors;
let maxFrames;
let minTight;

function setup() {
  createCanvas(windowWidth, windowHeight);
  //frameRate(15);
  //noLoop();
  
  colors = ["#F7E9CE", "#439AC8", "#F8D348", "#D13326", "#010405"];
  
  maxFrames = 150;
	minTight = random(-0.5, 0.5);
  
  background(colors.splice(random(colors.length), 1)[0]);
}

function draw() {
  if (random() < 0.6) {
    drawLine();
  }
  if (random() < 0.8) {
    drawDrop();
  }
  if (frameCount > maxFrames) {
    noLoop();
  }
}

function drawLine() {
  stroke(random(colors));
  noFill();
  let n = random(5, 15);
  let points = [];
  
  let w = random(width/4, 3 * width/4);
  let h = random(height/4, 3 * height/4);
  let x0 = random(-width/3, width - w + width/3);
  let y0 = random(-height/3, height - h + height/3);
  translate(x0 + w/2, y0 + h/2); 
  //let theta = random(TWO_PI);
  //rotate(theta);
  
	let x = random(-w/2, w/2);
	let y = random(-h/2, h/2);
  for (let i = 0; i < n; i++) {
    points.push(createVector(x, y));
		if (i % 2 === 0) {
			y = random(-h/2, h/2);
		} else {
			x = random(-w/2, w/2);
		}
  }
  for (let i = 0; i < n; i++) {
    strokeWeight(random(1, 2.5));
		curveTightness(random(minTight, minTight + 0.2));
    beginShape();
    for (let p of points) {
      let nzx = noise(p.x, p.y, frameCount + i/4);
      let nzy = noise(p.x, p.y, frameCount + i/4 + 1);
      curveVertex(p.x + (nzx - 1/2)*10, p.y + (nzy - 1/2)*10);
    }
    endShape();
  }
}

function drawDrop() {
  fill(random(colors));
  noStroke();
  
  let size = randomGaussian(3, 2);
  let xCenter = random(width);
  let yCenter = random(height);
  let maxNoise = randomGaussian(2, 3);
  
  beginShape();
  let angleStep = TWO_PI / floor(random(5, 10));
  for (let theta = 0; theta <= TWO_PI + 3 * angleStep; theta += angleStep) {
    let r1, r2;
		r1 = cos(theta)+1;
		r2 = sin(theta)+1;
    let r = size + noise(r1*2, r2*2, frameCount) * maxNoise;
    let x = xCenter + r * cos(theta);
    let y = yCenter + r * sin(theta);
    curveVertex(x, y);
  }
  endShape();
}