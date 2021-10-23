let modules;

let ARTWORK_RINGS = countRings(TOTAL_MODULES);

//--------------------------------------------------//

function setup() {
  createCanvas(windowWidth, windowHeight);
  createModules();
  frameRate(30);

  rectMode(CENTER);
  ellipseMode(CENTER);

  strokeCap(SQUARE);
}

//--------------------------------------------------//

function draw() {
  background(0);

  push();
  translate(width / 2, height / 2);

  for (let i = 0; i < TOTAL_MODULES; i++) {
    push();
    translate(modules[i].posX, modules[i].posY);
    rotate(frameCount * modules[i].rotationSpeed);

    modules[i].run();
    modules[i].display();

    //modules[i].drawEnclosingShape();
    //modules[i].drawIndex();

    pop();
  }

  pop();
}

//--------------------------------------------------//

function countRings(n) {
  let rings = 0;
  let totalModules = n;

  while (totalModules > 0) {
    if (rings == 0) {
      totalModules--;
    } else {
      totalModules -= rings * VERTICES;
    }

    rings++;
  }

  return rings;
}

//--------------------------------------------------//

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//--------------------------------------------------//

function createModules() {
  modules = new Array();

  let x = 0;
  let y = 0;

  let i = 0;
  let currentRingIndex = 0;

  while (i < TOTAL_MODULES) {
    if (currentRingIndex == 0) {
      let m = new Module(i++, x, y, RADIUS, VERTICES, PETAL_MAX_SIZE);
      modules.push(m);
    } else {
      let vertexLength = currentRingIndex;
      let currentVertex = 0;

      while (currentVertex < VERTICES && i < TOTAL_MODULES) {
        for (let step = 0; step < vertexLength; step++) {
          if (i < TOTAL_MODULES) {
            let m = new Module(i++, x, y, RADIUS, VERTICES, PETAL_MAX_SIZE);
            modules.push(m);

            x -= RADIUS * 2 * cos((PI / 3) * (1 - currentVertex));
            y -= RADIUS * 2 * sin((PI / 3) * (1 - currentVertex));
          } else {
            break;
          }
        }

        currentVertex++;
      }
    }

    currentRingIndex++;
    x += RADIUS * 2;
  }

  for (let i = 0; i < TOTAL_MODULES; i++) {
    let m = new Module(i, 0, 0, RADIUS, VERTICES, PETAL_MAX_SIZE);
    modules.push(m);
  }
}

//--------------------------------------------------//

function mouseClicked() {
  //save("export.png");

  background(0);
  createModules();
}
