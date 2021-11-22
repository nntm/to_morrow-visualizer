let mainViewCanvas;
let modules;

let DIR = "/assets/";
let newsreader;
let recursive;

//--------------------------------------------------//
//--------------------------------------------------//
//--------------------------------------------------//

let JSON_URL =
    "http://ec2-52-221-184-232.ap-southeast-1.compute.amazonaws.com:8080//vfcd21/v1/processed-data";

function updateModules() {
    let update = [];

    let json = loadJSON(JSON_URL, function (json) {
        TOTAL_MODULE_COUNT = json.system.total_entry_count;

        calcSizes(TOTAL_MODULE_COUNT);

        let coordinates = calcCoordinates();

        for (let i = 0; i < json.entries.length; i++) {
            addModule(
                update,
                json.entries[i].data_index,
                json.entries[i].id,
                json.entries[i].is_new,
                coordinates[json.entries.length - i - 1],
                json.entries[i].instagram,
                json.entries[i].weather,
                json.entries[i].visualization
            );
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
    let m = new Module(
        index,
        id,
        isNew,
        pos,
        instagram,
        weather,
        visualization
    );

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

            while (
                currentVertex < MODULE_VERTEX_COUNT &&
                i < TOTAL_MODULE_COUNT
            ) {
                for (let step = 0; step < vertexLength; step++) {
                    if (i < TOTAL_MODULE_COUNT) {
                        let v = createVector(x, y);
                        arr.push(v);
                        i++;

                        x -=
                            MODULE_RADIUS *
                            2 *
                            cos((PI / 3) * (1 - currentVertex));
                        y -=
                            MODULE_RADIUS *
                            2 *
                            sin((PI / 3) * (1 - currentVertex));
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

    resize(newWidth, newHeight) {
        resizeCanvas(newWidth, newHeight);
    }
}

//--------------------------------------------------//
//--------------------------------------------------//
//--------------------------------------------------//

function preload() {
    newsreader = loadFont(DIR + "Newsreader-LightItalic.ttf");
    recursive = loadFont(DIR + "Recursive_Monospace-Regular.ttf");
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

    FRAME_COUNT = 0;

    rectMode(CENTER);
    ellipseMode(CENTER);

    strokeCap(SQUARE);

    modules = updateModules();
}

//--------------------------------------------------//

function calcSizes(moduleCount) {
    ARTWORK_RING_COUNT = countRings(moduleCount);

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

    FPS_RELATIVE_SPEED =
        frameRate() >= 5 ? (FPS_DEFAULT * 1.0) / frameRate() : 1;

    if (modules != null) {
        push();
        translate(width / 2, height / 2);

        for (let i = 0; i < TOTAL_MODULE_COUNT; i++) {
            modules[i].run();

            push();
            translate(modules[i].pos.x, modules[i].pos.y);

            push();
            rotate(FRAME_COUNT * modules[i].rotationSpeed);
            modules[i].display();

            pop();

            if (
                dist(
                    mouseX,
                    mouseY,
                    modules[i].pos.x + width / 2,
                    modules[i].pos.y + height / 2
                ) <= MODULE_RADIUS
            ) {
                // modules[i].drawEnclosingShape();
                // modules[i].drawIndex();
                modules[i].drawMetadataTooltip();
            }

            pop();
        }

        pop();
    }

    FRAME_COUNT++;
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

//--------------------------------------------------//
//--------------------------------------------------//
//--------------------------------------------------//

const dd = (date) => {
    let a;
    a = JSON.stringify(new Date(date).getDate());

    return a < 10 ? `0${a}` : a;
};

// Month
const mm = (date) => {
    let a;
    a = JSON.stringify(new Date(date).getMonth() + 1);

    return a < 10 ? `0${a}` : a;
};

// Year
const yy = (date) => {
    let a;
    a = JSON.stringify(new Date(date).getFullYear()).substring(2, 4);

    return a < 10 ? `0${a}` : a;
};

// Hour
const h = (date) => {
    let a;
    a = JSON.stringify(new Date(date).getHours());

    return a < 10 ? `0${a}` : a;
};

// Minute
const m = (date) => {
    let a;
    a = JSON.stringify(new Date(date).getMinutes());

    return a < 10 ? `0${a}` : a;
};

// Second
const s = (date) => {
    let a;
    a = JSON.stringify(new Date(date).getSeconds());

    return a < 10 ? `0${a}` : a;
};
