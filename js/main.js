let mainViewCanvas;
let modules;

//--------------------------------------------------//
//--------------------------------------------------//
//--------------------------------------------------//

let JSON_URL =
  "http://ec2-52-221-184-232.ap-southeast-1.compute.amazonaws.com:8080//vfcd21/v1/processed-data";

function updateModules() {
  let update = [];

  let json = loadJSON(JSON_URL, function (json) {
    TOTAL_MODULE_COUNT = json.system.total_entry_count;

    let coordinates = calcCoordinates();

    for (let i = 0; i < json.entries.length; i++) {
      addModule(
        update,
        json.entries[i].data_index,
        json.entries[i].id,
        json.entries[i].is_new,
        coordinates[i],
        json.entries[i].visualization
      );

      /*
      console.log();
      console.log(json.entries[i].index);
      console.log(json.entries[i].instagram.link_to_original_post);
      console.log(json.entries[i].instagram.username);
      */
    }
  });

  return update;
}

//--------------------------------------------------//

function addModule(
  arr,
  index,
  id,
  isNew,
  pos,
  instagram,
  weather,
  visualization
) {
  let m = new Module(index, id, isNew, pos, instagram, weather, visualization);
  arr.push(m);
}

//--------------------------------------------------//

function calcCoordinates() {
  let arr = [];

  let x = 0;
  let y = 0;

  let i = 0;
  let currentRingIndex = 0;

  while (i < TOTAL_MODULE_COUNT) {
    if (currentRingIndex == 0) {
      let v = createVector(x, y);
      arr.push(v);
      i++;
    } else {
      let vertexLength = currentRingIndex;
      let currentVertex = 0;

      while (currentVertex < MODULE_VERTEX_COUNT && i < TOTAL_MODULE_COUNT) {
        for (let step = 0; step < vertexLength; step++) {
          if (i < TOTAL_MODULE_COUNT) {
            let v = createVector(x, y);
            arr.push(v);
            i++;

            x -= MODULE_RADIUS * 2 * cos((PI / 3) * (1 - currentVertex));
            y -= MODULE_RADIUS * 2 * sin((PI / 3) * (1 - currentVertex));
          } else break;
        }

        currentVertex++;
      }
    }

    currentRingIndex++;
    x += MODULE_RADIUS * 2;
  }

  return arr;
}

//--------------------------------------------------//
//--------------------------------------------------//
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

//--------------------------------------------------//

function setup() {
  mainViewCanvas = new ModuleCanvas(
    windowWidth,
    windowHeight,
    "main-view-wrapper"
  );

  frameRate(FPS_DEFAULT);
  FPS_RELATIVE_SPEED = 1;

  rectMode(CENTER);
  ellipseMode(CENTER);

  strokeCap(SQUARE);

  modules = updateModules();

  calcSizes();

  /*
  setInterval(function () {
    modules = updateModules();
  }, REFRESH_INTERVAL);
  */
}

//--------------------------------------------------//

function calcSizes() {
  ARTWORK_RING_COUNT = countRings(20);

  if (windowWidth < windowHeight) {
    MODULE_RADIUS = (windowWidth * 1.2) / (ARTWORK_RING_COUNT * 2 + 1) / 2;
  } else {
    MODULE_RADIUS = (windowHeight * 1.2) / (ARTWORK_RING_COUNT * 2 + 1) / 2;
  }
}

//--------------------------------------------------//

function windowResized() {
  mainViewCanvas.resize(windowWidth, windowHeight);
}

//--------------------------------------------------//
//--------------------------------------------------//
//--------------------------------------------------//

function draw() {
  background(0);

  FPS_SPEED = (FPS_DEFAULT * 1.0) / frameRate();

  push();
  translate(width / 2, height / 2);

  for (let i = 0; i < TOTAL_MODULE_COUNT; i++) {
    push();
    translate(modules[i].pos.x, modules[i].pos.y);
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
//--------------------------------------------------//
//--------------------------------------------------//

function countRings(n) {
  let rings = 0;
  let totalModules = n;

  while (totalModules > 0) {
    if (rings == 0) {
      totalModules--;
    } else {
      totalModules -= rings * MODULE_VERTEX_COUNT;
    }

    rings++;
  }

  return rings;
}
