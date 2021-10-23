class Ray {
  constructor(
    color,
    angle,
    maxLifespan,
    lifespanRange,
    maxLengthRatio,
    kRadius,
    strokeWeight
  ) {
    this.color = color;
    this.angle = angle;

    this.isOutward = true;

    this.lifespan1 = round(
      maxLifespan *
        constrain(random(1 - lifespanRange / 2, 1 + lifespanRange / 2), 0, 1)
    );
    this.progress1 = this.isOutward ? 0 : this.lifespan1;

    this.lifespan2 = round(
      maxLifespan *
        constrain(random(1 - lifespanRange / 2, 1 + lifespanRange / 2), 0, 1)
    );
    this.progress2 = this.isOutward ? 0 : this.lifespan2;

    this.isLongest = false;
    this.isDead = false;

    this.kRadius = kRadius;
    this.maxLength = maxLengthRatio * this.kRadius;

    this.root = random(0, kRadius - this.maxLength);

    this.strokeWeight = strokeWeight;
  }

  update() {
    if (this.isOutward) {
      this.x1 = map(
        this.progress1,
        0,
        this.lifespan1,
        this.root,
        this.maxLength
      );
      this.x2 = map(
        this.progress2,
        0,
        this.lifespan2,
        this.root,
        this.maxLength
      );

      if (!this.isLongest) {
        this.isLongest = ++this.progress1 >= this.lifespan1;
      } else {
        this.progress2++;
      }

      if (this.isLongest && this.progress2 >= this.lifespan2) {
        this.isDead = true;
      }
    } else {
      this.x1 = map(
        this.progress1,
        0,
        this.lifespan1,
        this.kRadius - this.maxLength,
        this.kRadius
      );
      this.x2 = map(
        this.progress2,
        0,
        this.lifespan2,
        this.kRadius - this.maxLength,
        this.kRadius
      );

      if (!this.isLongest) {
        this.isLongest = --this.progress1 <= 0;
      } else {
        this.progress2--;
      }

      if (this.isLongest && this.progress2 <= 0) {
        this.isDead = true;
      }
    }
  }

  display() {
    noFill();
    stroke(this.color);
    strokeWeight(this.strokeWeight);

    push();
    rotate(this.angle);

    line(this.x1, 0, this.x2, 0);

    pop();
  }
}
