class Module {
  constructor(index, x, y, radius, vertices, maxPetalSize) {
    this.index = index;

    this.posX = x;
    this.posY = y;

    this.radius = radius;
    this.vertices = vertices;
    this.maxPetalSize = maxPetalSize;

    this.levelOfDetails = random(1);
    this.bpm = random(1);

    this.rotationSpeed = map(
      this.bpm,
      0,
      1,
      ROTATION_SPEED[0],
      ROTATION_SPEED[1]
    );

    // petal
    this.petals = [];
    colorMode(RGB, 255, 255, 255);
    this.petalColors = [
      color(46, 54, 20),
      color(221, 202, 204),
      color(163, 201, 235),
      color(133, 99, 69),
      color(169, 157, 180),
    ];
    this.petalShapeType =
      PETAL_SHAPE_TYPE[int(random(PETAL_SHAPE_TYPE.length))];
    this.petalOpacity = map(
      this.levelOfDetails,
      0,
      1,
      PETAL_OPACITY[0],
      PETAL_OPACITY[1]
    );
    this.petalPhase = map(
      this.levelOfDetails,
      0,
      1,
      PETAL_PHASE[0],
      PETAL_PHASE[1]
    );
    this.petalPhaseCount = this.petalPhase;
    this.petalColorPhase = map(
      this.levelOfDetails,
      0,
      1,
      PETAL_COLOR_PHASE[0],
      PETAL_COLOR_PHASE[1]
    );
    this.petalColorPhaseCount = this.petalColorPhase;
    this.petalCurrentColorIndex = int(random(this.petalColors.length));
    this.petalLifespan = map(
      this.bpm,
      0,
      1,
      PETAL_LIFESPAN[0],
      PETAL_LIFESPAN[1]
    );
    this.petalNoiseSegment = map(
      this.bpm,
      0,
      1,
      PETAL_NOISE_SEGMENT[0],
      PETAL_NOISE_SEGMENT[1]
    );
    this.petalNoiseMapIncrement = map(
      this.bpm,
      0,
      1,
      PETAL_NOISE_MAP_INCREMENT[0],
      PETAL_NOISE_MAP_INCREMENT[1]
    );
    this.petalNoisePos = 0;

    this.petalDirection = TWO_PI * random(1);

    // texture
    this.slices =
      this.vertices *
      round(
        map(
          this.levelOfDetails,
          0,
          1,
          SLICE_DIVISION_MULTIPLIER[0],
          SLICE_DIVISION_MULTIPLIER[1]
        )
      );
    this.strokeWeight = map(
      random(1),
      0,
      1,
      STROKE_WEIGHT[0],
      STROKE_WEIGHT[1]
    );

    // ray
    this.rays = [];
    this.rayPhase = map(this.levelOfDetails, 0, 1, RAY_PHASE[0], RAY_PHASE[1]);
    this.rayPhaseCount = this.rayPhase;
    this.rayLifespan = map(this.bpm, 0, 1, RAY_LIFESPAN[0], RAY_LIFESPAN[1]);
    this.rayLifespanRange = map(
      this.levelOfDetails,
      0,
      1,
      RAY_LIFESPAN_RANGE[0],
      RAY_LIFESPAN_RANGE[1]
    );
    this.rayMaxLengthRatio = map(
      this.levelOfDetails,
      0,
      1,
      RAY_MAX_LENGTH_RATIO[0],
      RAY_MAX_LENGTH_RATIO[1]
    );
    this.rayDensity = map(this.levelOfDetails, 0, 1, 1, 6);

    // arc
    this.arcs = [];
    this.arcOpacity = this.petalOpacity;
    this.arcPhase = map(this.levelOfDetails, 1, 0, ARC_PHASE[0], ARC_PHASE[1]);
    this.arcPhaseCount = this.arcPhase;

    this.arcSpan = random(1);
    this.arcIsClockwise = this.arcSpan <= 0.5 ? false : true;

    this.arcLifespan = map(this.bpm, 1, 0, ARC_LIFESPAN[0], ARC_LIFESPAN[1]);
    this.arcLifespanRange = map(
      this.levelOfDetails,
      1,
      0,
      ARC_LIFESPAN_RANGE[0],
      ARC_LIFESPAN_RANGE[1]
    );
  }

  //--------------------------------------------------//

  run() {
    this.noiseSeedMemory = int(random(MAX_NOISE_SEED));
    this.petalNoisePos += this.petalNoiseMapIncrement;

    if (this.petalPhaseCount++ >= this.petalPhase) {
      let color1 = this.petalColors[this.petalCurrentColorIndex];
      let color2;
      if (this.petalCurrentColorIndex < this.petalColors.length - 1) {
        color2 = this.petalColors[this.petalCurrentColorIndex + 1];
      } else {
        color2 = this.petalColors[0];
      }

      this.addPetal(
        lerpColor(
          color1,
          color2,
          map(this.petalColorPhaseCount, 0, this.petalColorPhase, 0, 1)
        )
      );

      this.petalPhaseCount = 0;
    }

    if (this.petalColorPhaseCount++ >= this.petalColorPhase) {
      this.petalColorPhaseCount = 0;

      if (this.petalCurrentColorIndex++ >= this.petalColors.length - 1) {
        this.petalCurrentColorIndex = 0;
      }
    }

    for (let i = this.petals.length - 1; i >= 0; i--) {
      let petal = this.petals[i];
      petal.update(this.petalNoisePos);

      if (petal.isDead) {
        this.petals.splice(i, 1);
      }
    }

    if (this.rayPhaseCount++ >= this.rayPhase) {
      for (let i = 0; i < this.rayDensity; i++) {
        this.addRay(
          this.petalColors[int(random(this.petalColors.length))],
          (TWO_PI / this.slices) * ceil(random(this.slices))
        );
      }

      this.rayPhaseCount = 0;
    }

    for (let i = this.rays.length - 1; i >= 0; i--) {
      let r = this.rays[i];
      r.update();

      if (r.isDead) {
        this.rays.splice(i, 1);
      }
    }

    if (this.arcPhaseCount++ >= this.arcPhase) {
      this.addArc(this.petalColors[int(random(this.petalColors.length))]);
      this.arcPhaseCount = 0;
    }

    for (let i = this.arcs.length - 1; i >= 0; i--) {
      let a = this.arcs[i];
      a.update();

      if (a.isDead) {
        this.arcs.splice(i, 1);
      }
    }
  }

  //--------------------------------------------------//

  display() {
    blendMode(SCREEN);

    for (let petal of this.petals) {
      for (let i = 0; i < this.vertices; i++) {
        rotate(TWO_PI / this.vertices);

        push();
        translate(this.radius / 2, 0);
        rotate(this.petalDirection);

        petal.display();

        pop();
      }
    }

    for (let r of this.rays) {
      r.display();
    }

    for (let a of this.arcs) {
      a.display();
    }
  }

  //--------------------------------------------------//

  drawIndex() {
    noStroke();
    fill(this.petalColors[0]);

    textSize(30);
    textAlign(CENTER, CENTER);

    text(this.index, 0, 0);
  }

  drawEnclosingShape() {
    noFill();
    stroke(this.petalColors[0]);

    beginShape();
    for (let a = HALF_PI; a < TWO_PI + HALF_PI; a += TWO_PI / this.vertices) {
      let sx = cos(a) * this.radius;
      let sy = sin(a) * this.radius;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }

  //--------------------------------------------------//

  addPetal(color) {
    let petal = new Petal(
      this.petalShapeType,
      color,
      this.petalOpacity,
      this.radius,
      this.maxPetalSize,
      this.petalLifespan,
      noiseSeed,
      this.petalNoiseSegment,
      this.rotationSpeed * random(2)
    );

    this.petals.push(petal);
  }

  addRay(color, angle) {
    let r = new Ray(
      color,
      angle,
      this.rayLifespan,
      this.rayLifespanRange,
      this.rayMaxLengthRatio,
      this.radius,
      this.strokeWeight
    );

    this.rays.push(r);
  }

  addArc(color) {
    let a = new Arc(
      color,
      this.arcOpacity,
      this.slices,
      this.arcSpan,
      this.radius,
      this.arcIsClockwise,
      this.arcLifespan,
      this.arcLifespanRange,
      this.strokeWeight
    );

    this.arcs.push(a);
  }
}
