let mainViewCanvas;
let modules;

//let ARTWORK_RINGS = countRings(TOTAL_MODULES);

//--------------------------------------------------//

let JSON_URL =
  "http://ec2-52-221-184-232.ap-southeast-1.compute.amazonaws.com:8080//vfcd21/v1/processed-data";

function getDataFromAPI() {
  modules = [];

  let json = loadJSON(JSON_URL, function (json) {
    for (let i = 0; i < json.entries.length; i++) {
      if (json.entries[i].is_new) {
        addModule(modules.length, json.entries[i].visualization);
      }
    }
  });

  console.log(modules);
}

//--------------------------------------------------//

function addModule(index, visualization) {
  let m = new Module(
    index,
    createVector(random(width), random(height)),
    visualization
  );
  modules.push(m);
}

//--------------------------------------------------//

class ModuleCanvas {
  constructor(width, height, parentID) {
    this.width = width;
    this.height = height;

    this.parentID = parentID;

    this.canvas = createCanvas(this.width, this.height);
    this.canvas.parent(parentID);

    this.maxZoomLvl = 1;
    this.minZoomLvl = 0;
    this.currentZoomLvl = 0;
  }

  resize(width, height) {
    resizeCanvas(windowWidth, windowHeight);
  }
}

function setup() {
  mainViewCanvas = new ModuleCanvas(
    windowWidth,
    windowHeight,
    "main-view-wrapper"
  );

  frameRate(30);

  rectMode(CENTER);
  ellipseMode(CENTER);

  strokeCap(SQUARE);

  modules = [];

  getDataFromAPI();

  setInterval(function () {
    getDataFromAPI();
  }, REFRESH_INTERVAL);
}

function windowResized() {
  mainViewCanvas.resize(windowWidth, windowHeight);
}

//--------------------------------------------------//

let lastUpdate;

function draw() {
  background(0);

  push();
  translate(width / 2, height / 2);

  for (let i = 0; i < modules.length; i++) {
    push();
    translate(modules[i].x, modules[i].y);
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

function calcPositions(index) {
  let x = 0;
  let y = 0;

  let i = 0;
  let currentRingIndex = 0;

  while (i < index) {
    let vertexLength = currentRingIndex;
    let currentVertex = 0;

    while (currentVertex < VERTICES && i < index) {
      for (let step = 0; step < vertexLength; step++) {
        if (i < index) {
          x -= RADIUS * 2 * cos((PI / 3) * (1 - currentVertex));
          y -= RADIUS * 2 * sin((PI / 3) * (1 - currentVertex));
        } else {
          break;
        }
      }

      currentVertex++;
    }

    currentRingIndex++;
    x += RADIUS * 2;
  }

  pos = createVector(x, y);
  console.log(pos);
  return pos;
}

//--------------------------------------------------//

function mouseClicked() {
  //save("export.png");
  //background(0);
  //createModules();
}
