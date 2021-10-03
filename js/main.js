let k;

function setup() {
  createCanvas(windowWidth, windowHeight);

  k = new Kaleidoscope(RADIUS, VERTICES, MAX_PETAL_SIZE);

  colorMode(RGB, 255, 255, 255, 1);
  PALETTE = [
    color(random(255), random(255), random(255), OPACITY),
    color(random(255), random(255), random(255), OPACITY),
    color(random(255), random(255), random(255), OPACITY),
    color(random(255), random(255), random(255), OPACITY),
    color(random(255), random(255), random(255), OPACITY),
  ];

  noStroke();
}

//--------------------------------------------------//

function draw() {
  background(255, 255, 255);

  push();
  translate(width / 2, height / 2);
  //rotate(-frameCount / 500);

  k.run();
  k.display();

  pop();
}

//--------------------------------------------------//

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
