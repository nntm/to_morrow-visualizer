let COL = 1;
let ROW = 1;

let RADIUS = 200;
let VERTICES = 6;
let OPACITY = [0.5, 0.15];
let PETAL_PHASE = [60, 15];
let COLOR_PHASE = [80, 30];
let MAX_PETAL_SIZE = RADIUS * 2;
let PETAL_LIFESPAN = [550, 250];
let MAX_NOISE_SEED = 10000;
let NOISE_SEGMENT = [0.05, 0.4];
let NOISE_MAP_INCREMENT = [0.001, 0.01];

//--------------------------------------------------//

class Kaleidoscope {
  constructor(radius, vertices, maxPetalSize) {
    this.radius = radius;
    this.vertices = vertices;
    this.maxPetalSize = maxPetalSize;

    // constants
    this.levelOfDetails = random(1);
    this.opacity = map(this.levelOfDetails, 0, 1, OPACITY[0], OPACITY[1]);
    this.petalPhase = map(
      this.levelOfDetails,
      0,
      1,
      PETAL_PHASE[0],
      PETAL_PHASE[1]
    );
    //console.log(this.petalPhase);
    this.colorPhase = map(
      this.levelOfDetails,
      0,
      1,
      COLOR_PHASE[0],
      COLOR_PHASE[1]
    );
    //console.log(this.colorPhase);

    colorMode(RGB, 255, 255, 255, 1);
    this.colors = [
      color(random(255), random(255), random(255), this.opacity),
      color(random(255), random(255), random(255), this.opacity),
      color(random(255), random(255), random(255), this.opacity),
    ];

    this.bpm = random(1);
    this.petalLifespan = map(
      this.bpm,
      0,
      1,
      PETAL_LIFESPAN[0],
      PETAL_LIFESPAN[1]
    );
    //console.log(this.petalLifespan);
    this.noiseSegment = map(this.bpm, 0, 1, NOISE_SEGMENT[0], NOISE_SEGMENT[1]);
    //console.log(this.noiseSegment);
    this.noiseMapIncrement = map(
      this.bpm,
      0,
      1,
      NOISE_MAP_INCREMENT[0],
      NOISE_MAP_INCREMENT[1]
    );
    //console.log(this.noiseMapIncrement);

    this.petalPhaseCount = 0;
    this.petals = [];

    this.colorPhaseCount = 0;
    this.currentColorIndex = 0;

    this.noisePos = 0;
  }

  run() {
    this.noiseSeed = int(random(MAX_NOISE_SEED));
    this.noisePos += this.noiseMapIncrement;

    if (this.petalPhaseCount++ >= this.petalPhase) {
      let color1 = this.colors[this.currentColorIndex];
      let color2;
      if (this.currentColorIndex < this.colors.length - 1) {
        color2 = this.colors[this.currentColorIndex + 1];
      } else {
        color2 = this.colors[0];
      }

      this.addPetal(
        lerpColor(
          color1,
          color2,
          map(this.colorPhaseCount, 0, this.colorPhase, 0, 1)
        ),
        this.radius,
        this.maxPetalSize,
        this.noiseSeed
      );

      this.petalPhaseCount = 0;
    }

    if (this.colorPhaseCount++ >= this.colorPhase) {
      this.colorPhaseCount = 0;

      if (this.currentColorIndex++ >= this.colors.length - 1) {
        this.currentColorIndex = 0;
      }
    }

    for (let i = this.petals.length - 1; i >= 0; i--) {
      let petal = this.petals[i];
      petal.update(this.noisePos);

      if (petal.isDead) {
        this.petals.splice(i, 1);
      }
    }
  }

  display() {
    for (let petal of this.petals) {
      for (let i = 0; i < this.vertices; i++) {
        push();
        rotate((TWO_PI * i) / this.vertices);

        petal.display();

        pop();
      }
    }
  }

  addPetal(color, kRadius, maxSize, noiseSeed) {
    let petal = new Petal(
      0,
      color,
      kRadius,
      maxSize,
      this.petalLifespan,
      noiseSeed,
      this.noiseSegment
    );
    this.petals.push(petal);
  }

  removePetal() {
    this.petals.length--;
  }
}

//--------------------------------------------------//

class Petal {
  constructor(
    x,
    color,
    kRadius,
    maxSize,
    maxLifespan,
    noiseSeed,
    noiseSegment
  ) {
    this.x = x;
    this.color = color;

    this.kRadius = kRadius;

    this.size = 0;
    this.maxSize = maxSize;
    this.isRect = round(random(1)) == 0 ? true : false;

    this.maxLifespan = maxLifespan;
    this.lifespan = this.maxLifespan;
    this.isDead = false;

    this.noiseSeed = noiseSeed;
    this.noiseSegment = noiseSegment;
  }

  update(noisePos) {
    if (this.lifespan >= 0) {
      this.x = map(this.lifespan, this.maxLifespan, 0, 0, 1) * this.kRadius;

      this.width =
        sin(map(this.lifespan, this.maxLifespan, 0, TWO_PI, 0)) *
        noise(
          map(this.lifespan, this.maxLifespan, 0, 0, this.noiseSegment),
          noisePos
        ) *
        this.maxSize;

      this.height =
        sin(map(this.lifespan, this.maxLifespan, 0, PI * 3, PI)) *
        noise(
          noisePos,
          map(this.lifespan, this.maxLifespan, 0, 0, this.noiseSegment)
        ) *
        this.maxSize;

      this.lifespan--;
    } else {
      this.isDead = true;
    }
  }

  display() {
    fill(this.color);

    if (this.isRect) {
      rectMode(CENTER);
      rect(this.x, 0, this.width, this.height);
    } else {
      ellipseMode(CENTER);
      ellipse(this.x, 0, this.width, this.height);
    }
  }
}
