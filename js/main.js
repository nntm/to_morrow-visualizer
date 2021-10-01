let img;

function preload() {
  img = loadImage("assets/image.jpg");
}

//--------------------------------------------------//

let palette;

function setup() {
  createCanvas(800, 800);
  palette = colorThief.getPalette(img, 4);
  console.log(palette);
}

//--------------------------------------------------//

function draw() {
  background(255);
}
