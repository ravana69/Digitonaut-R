const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

window.onload = window.onresize = function() {
  const scale = window.devicePixelRatio;
  canvas.width = window.innerWidth * scale;
  canvas.height = window.innerHeight * scale;
  ctx.scale(scale, scale);
  
  setup();
  window.requestAnimationFrame(draw);
}

const size = 8;
var cells, next, xOff, yOff, width, height;
var offset;
function setup() {
  cells = [];
  Cell.colorSize = 3; //Math.ceil(Math.random()*5)+3;
  xOff = canvas.width % size;
  yOff = canvas.height % size;
  width = (canvas.width - xOff) / size;
  height = (canvas.height - yOff) / size;
  for (let i = 0; i < width * height; i++)
    cells.push(new Cell(i % width, Math.floor(i / width)));
  offset = 1; //Math.round(Math.random() * 2);
}

function draw() {
  window.requestAnimationFrame(draw);  
  ctx.fillStyle = '#1e1f26'; // Codepen color!
  ctx.fillRect(0,0,canvas.width,canvas.height);
  for (const n in cells) cells[n].draw();
}

window.setInterval( function() {
  next = [];
  for (const n in cells)
    next.push(cells[n].next(parseInt(n),cells));
  for (const n in cells)
    cells[n].color = next[n];
},100);

window.onclick = function(event) {
  setup();
}

class Cell {
  constructor(x,y) {
    if (typeof Cell.colors == 'undefined') {
      Cell.colors = {
        'A':0,
        'B':225,
        'C':90,
        'D':135,
        'E':180,
        'F':45,
        'G':270,
        'H':315
      }
      Cell.threshold = 2;
    }
    this.x = x;
    this.y = y;
    //this.color = String.fromCharCode(
    //  65 + Math.floor((this.x / width) * Cell.colorSize)
    //);
    //if (Math.random() > 0.75) 
    this.color = String.fromCharCode(
      65 + Math.floor(Math.random() * Cell.colorSize)
    );
    
  }
  next(i,state) {
    let count = {};
    for (const key in Cell.colors) count[key] = 0;
    
    let horizOffset = 0; // handles horizontal wrapping
    let vertOffset = 0;
    
    if (i % width == 0)           horizOffset = width;
    if (i % width == width - 1)   horizOffset = -width;
    if (i < width)                vertOffset = state.length - width;
    if (i > (height - 1) * width) vertOffset = width - state.length;
    let indices = [
      i-width-1 + horizOffset + vertOffset,
      i-width   + vertOffset,
      i-width+1 + horizOffset + vertOffset,
      i+1       + horizOffset,
      i-1       + horizOffset,
      i+width-1 + horizOffset + vertOffset,
      i+width   + vertOffset,
      i+width+1 + horizOffset + vertOffset
    ];
    for (const j of indices)
      if (state[j] != null)
        count[state[j].color]++;
    
    let thisCode = this.color.charCodeAt(0) - 65;
    for (const key in count) {
      let off = 2;//Math.round(Math.random()*Cell.colorSize);
      let keyCode = key.charCodeAt(0) - 65;
      if (
        thisCode != keyCode &&
        count[key] >= Cell.threshold + offset &&
        // the following code sets the rules
        (keyCode + off) % Cell.colorSize != thisCode % Cell.colorSize
      ) return key;
    }
    return this.color;
  }
  draw() {
    ctx.fillStyle = 'hsl(' + 
      Cell.colors[this.color] + 
      ',50%,50%)';
    ctx.fillRect(
      (xOff - xOff%2)/2 + size*this.x + 1,
      (yOff - yOff%2)/2 + size*this.y + 1,
      size,size
    )
  }
}