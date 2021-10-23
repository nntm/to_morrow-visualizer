class Arc {
  constructor(
    color,
    opacity,
    slices,
    arcSpan,
    kRadius,
    isClockwise,
    maxLifespan,
    lifespanRange,
    strokeWeight
  ) {
    this.color = color;
    this.opacity = opacity;

    this.radius = random(kRadius);

    this.isClockwise = isClockwise;

    this.slices = slices;
    this.arcAngleSpan = map(arcSpan, 0, 1, 0, TWO_PI);
    this.begin = map(random(1), 0, 1, 0, TWO_PI);

    if (this.isClockwise) {
      this.end = this.begin + this.arcAngleSpan;
    } else {
      this.end = this.begin - this.arcAngleSpan;
    }

    this.lifespan1 = round(
      maxLifespan *
        constrain(random(1 - lifespanRange / 2, 1 + lifespanRange / 2), 0, 1)
    );
    this.progress1 = this.isClockwise ? 0 : this.lifespan1;

    this.lifespan2 = round(
      maxLifespan *
        constrain(random(1 - lifespanRange / 2, 1 + lifespanRange / 2), 0, 1)
    );
    this.progress2 = this.isClockwise ? 0 : this.lifespan2;

    this.isLongest = false;
    this.isDead = false;

    this.strokeWeight = strokeWeight;

    this.maxRadius = kRadius;

    this.a1 = 0;
    this.a2 = 0;

    this.seed = int(random(MAX_NOISE_SEED));
    this.noiseX = 0;
    this.noiseInc = 0.005;
  }

  update() {
    if (this.isClockwise) {
      this.a1 = map(this.progress1, 0, this.lifespan1, this.begin, this.end);
      this.a2 = map(this.progress2, 0, this.lifespan2, this.begin, this.end);

      if (!this.isLongest) {
        this.isLongest = ++this.progress1 >= this.lifespan1;
      } else {
        this.progress2++;
      }

      if (this.isLongest && this.progress2 >= this.lifespan2) {
        this.isDead = true;
      }
    } else {
      this.a1 = map(this.progress1, 0, this.lifespan1, this.end, this.begin);
      this.a2 = map(this.progress2, 0, this.lifespan2, this.end, this.begin);

      if (!this.isLongest) {
        this.isLongest = --this.progress1 <= 0;
      } else {
        this.progress2--;
      }

      if (this.isLongest && this.progress2 <= 0) {
        this.isDead = true;
      }
    }

    noiseSeed(this.seed);

    this.radius = map(
      noise(this.noiseX),
      0,
      1,
      this.strokeWeight,
      this.maxRadius
    );

    this.noiseX += this.noiseInc;
  }

  display() {
    blendMode(SCREEN);
    noFill();
    stroke(255, 255, 255, this.opacity);
    strokeWeight(this.strokeWeight);

    if (this.isClockwise) {
      arc(0, 0, this.radius * 2, this.radius * 2, this.a2, this.a1);
    } else {
      arc(0, 0, this.radius * 2, this.radius * 2, this.a1, this.a2);
    }
  }
}
