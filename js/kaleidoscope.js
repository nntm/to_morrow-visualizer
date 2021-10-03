let RADIUS = 200;
let VERTICES = 6;
let PALETTE;
let OPACITY = 0.35;
let PETAL_PHASE = 30;
let COLOR_PHASE = 60;
let MAX_PETAL_SIZE = 360;
let MAX_PETAL_LIFESPAN = 400;
let MAX_NOISE_SEED = 10000;
let NOISE_SEGMENT = 0.1;
let NOISE_INCREMENT = 0.004;

//--------------------------------------------------//

class Kaleidoscope {
  constructor(radius, vertices, maxPetalSize) {
    this.radius = radius;
    this.vertices = vertices;
    this.maxPetalSize = maxPetalSize;

    this.petalPhaseCount = 0;
    this.petals = [];

    this.colorPhaseCount = 0;
    this.currentColorIndex = 0;

    this.noiseY = 0;
  }

  run() {
    this.noiseSeed = int(random(MAX_NOISE_SEED));
    this.noiseY += NOISE_INCREMENT;

    if (this.petalPhaseCount++ >= PETAL_PHASE) {
      let color1 = PALETTE[this.currentColorIndex];
      let color2;
      if (this.currentColorIndex < PALETTE.length - 1) {
        color2 = PALETTE[this.currentColorIndex + 1];
      } else {
        color2 = PALETTE[0];
      }

      this.addPetal(
        lerpColor(
          color1,
          color2,
          map(this.colorPhaseCount, 0, COLOR_PHASE, 0, 1)
        ),
        this.radius,
        this.maxPetalSize,
        this.noiseSeed
      );

      this.petalPhaseCount = 0;
    }

    if (this.colorPhaseCount++ >= COLOR_PHASE) {
      this.colorPhaseCount = 0;

      if (this.currentColorIndex++ >= PALETTE.length - 1) {
        this.currentColorIndex = 0;
      }
    }

    for (let i = this.petals.length - 1; i >= 0; i--) {
      let petal = this.petals[i];
      petal.update(this.noiseY);

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
    let petal = new Petal(0, color, kRadius, maxSize, noiseSeed);
    this.petals.push(petal);
  }

  removePetal() {
    this.petals.length--;
  }
}

//--------------------------------------------------//

class Petal {
  constructor(x, color, kRadius, maxSize, noiseSeed) {
    this.x = x;
    this.color = color;

    this.kRadius = kRadius;

    this.size = 0;
    this.maxSize = maxSize;
    this.isRect = round(random(1)) == 0 ? true : false;

    this.lifespan = MAX_PETAL_LIFESPAN;
    this.isDead = false;

    this.noiseSeed = noiseSeed;
  }

  update(n) {
    if (this.lifespan >= 0) {
      this.x = map(this.lifespan, MAX_PETAL_LIFESPAN, 0, 0, 1) * this.kRadius;

      this.width =
        sin(map(this.lifespan, MAX_PETAL_LIFESPAN, 0, TWO_PI, 0)) *
        noise(map(this.lifespan, MAX_PETAL_LIFESPAN, 0, 0, NOISE_SEGMENT), n) *
        this.maxSize;

      this.height =
        sin(map(this.lifespan, MAX_PETAL_LIFESPAN, 0, PI * 3, PI)) *
        noise(n, map(this.lifespan, MAX_PETAL_LIFESPAN, 0, 0, NOISE_SEGMENT)) *
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
