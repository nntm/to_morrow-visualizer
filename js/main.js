let k = new Array();

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < COL; i++) {
    let row = [];

    for (let j = 0; j < ROW; j++) {
      let kItem = new Kaleidoscope(RADIUS, VERTICES, MAX_PETAL_SIZE);
      row.push(kItem);
    }

    k.push(row);
  }

  noStroke();
}

//--------------------------------------------------//

function draw() {
  background(255, 255, 255);

  //rotate(-frameCount / 500);
  push();

  translate(width / COL / 2, height / ROW / 2);

  for (let i = 0; i < COL; i++) {
    for (let j = 0; j < ROW; j++) {
      push();
      translate((width / COL) * i, (height / ROW) * j);

      k[i][j].run();
      k[i][j].display();

      pop();
    }
  }

  pop();
}

//--------------------------------------------------//

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//--------------------------------------------------//

function mouseClicked() {
  save("export.png");
}
