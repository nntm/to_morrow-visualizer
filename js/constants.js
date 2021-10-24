let TOTAL_MODULES = 200;

let MAX_NOISE_SEED = 10000;

let RADIUS = 50;
let VERTICES = 6;
let ROTATION_SPEED = [0.0001, 0.01];

let STROKE_WEIGHT = [RADIUS / 80, RADIUS / 20];

let PETAL_SHAPE_TYPE = ["TRIANGLE", "RECT", "ELLIPSE", "DIAMOND"];
let PETAL_OPACITY = [0.8, 0.5];
let PETAL_PHASE = [60, 22.5];
let PETAL_MAX_SIZE = RADIUS * 1.2;
let PETAL_LIFESPAN = [150, 60];
let PETAL_LIFESPAN_RANGE = 0.25;
let PETAL_COLOR_PHASE = [60, 60];
let PETAL_NOISE_SEGMENT = [0.05, 1];//noise_segment_length
let PETAL_NOISE_MAP_INCREMENT = [0.001, 0.008];//noise_segment_shift

let SLICE_DIVISION_MULTIPLIER = [60, 60];

let RAY_PHASE = [5, 45];
let RAY_LIFESPAN = [120, 30];
let RAY_LIFESPAN_RANGE = [1, 0];
let RAY_MAX_LENGTH_RATIO = [0.4, 1];

let ARC_PHASE = [30, 90];
let ARC_LIFESPAN = [300, 150];
let ARC_LIFESPAN_RANGE = [1, 0];
