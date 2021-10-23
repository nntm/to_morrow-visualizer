class Petal {
  constructor(
    shapeType,
    color,
    opacity,
    kRadius,
    maxSize,
    maxLifespan,
    noiseSeed,
    noiseSegment,
    rotationSpeed
  ) {
    this.shapeType = shapeType;
    this.triangleOutward = round(random(1)) == 0 ? true : false;

    this.x = 0;

    this.color = color;
    this.opacity = opacity;

    this.kRadius = kRadius;

    this.size = 0;
    this.maxSize = maxSize;

    this.isOutward = true;
    this.lifespan =
      maxLifespan *
      random(1 - PETAL_LIFESPAN_RANGE / 2, 1 + PETAL_LIFESPAN_RANGE / 2);
    this.progress = this.isOutward ? 0 : this.lifespan;
    this.isDead = false;

    this.noiseSeedMemory = noiseSeed;
    this.noiseSegment = noiseSegment;

    this.randomSineShift = random(PI);

    this.rotationSpeed = rotationSpeed;
  }

  update(petalNoisePos) {
    noiseSeed(this.noiseSeedMemory);

    this.x = map(this.progress, this.lifespan, 0, 0, 1) * this.kRadius;

    this.width =
      sin(map(this.progress, this.lifespan, 0, 0, PI)) *
      map(
        noise(
          map(this.progress, this.lifespan, 0, 0, this.noiseSegment),
          petalNoisePos
        ),
        0,
        1,
        0,
        this.maxSize
      );

    this.height =
      sin(map(this.progress, this.lifespan, 0, PI, 0)) *
      map(
        noise(
          petalNoisePos,
          -map(this.progress, this.lifespan, 0, 0, this.noiseSegment)
        ),
        0,
        1,
        0,
        this.maxSize
      );

    if (this.isOutward) {
      if (++this.progress > this.lifespan) {
        this.isDead = true;
      }
    } else {
      if (--this.progress < 0) {
        this.isDead = true;
      }
    }
  }

  display() {
    colorMode(RGB, 255, 255, 255, 1);
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.opacity);

    push();
    translate(this.x - this.kRadius / 2, 0);
    rotate(-frameCount * this.rotationSpeed);

    switch (this.shapeType) {
      case "RECT":
        rectMode(CENTER);
        rect(0, 0, this.width, this.height);
        break;
      case "ELLIPSE":
        ellipseMode(CENTER);
        ellipse(0, 0, this.width, this.height);
        break;
      case "TRIANGLE":
        if (this.triangleOutward) {
          triangle(
            -this.width / 2,
            0,
            this.width - this.width / 2,
            -this.height / 2,
            this.width - this.width / 2,
            this.height / 2
          );
        } else {
          triangle(
            this.width - this.width / 2,
            0,
            -this.width / 2,
            -this.height / 2,
            -this.width / 2,
            this.height / 2
          );
        }
        break;
      case "DIAMOND":
        beginShape();
        vertex(-this.width / 2, 0);
        vertex(this.width / 2 - this.width / 2, -this.height / 2);
        vertex(this.width - this.width / 2, 0);
        vertex(this.width / 2 - this.width / 2, this.height / 2);
        endShape(CLOSE);
        break;
    }

    pop();
  }
}
