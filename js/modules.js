let MAX_NOISE_SEED = 10000;

let RADIUS = 80;
let VERTICES = 6;
let ROTATION_SPEED = [0.0001, 0.01];

let STROKE_WEIGHT = RADIUS / 50;

let PETAL_SHAPE_TYPE = ["TRIANGLE", "RECT", "ELLIPSE", "DIAMOND"];
let PETAL_OPACITY = [0.8, 0.5];
let PETAL_PHASE = [60, 22.5];
let PETAL_MAX_SIZE = RADIUS * 1.2;
let PETAL_LIFESPAN = [150, 60];
let PETAL_LIFESPAN_RANGE = 0.25;
let PETAL_COLOR_PHASE = [45, 15];
let PETAL_NOISE_SEGMENT = [0.05, 1];
let PETAL_NOISE_MAP_INCREMENT = [0.001, 0.008];

let SLICE_DIVISION_MULTIPLIER = [1, 20];

let RAY_PHASE = [5, 45];
let RAY_LIFESPAN = [120, 30];
let RAY_LIFESPAN_RANGE = [1, 0];
let RAY_MIN_LENGTH_RATIO = [0.4, 1];

let ARC_PHASE = [5, 15];
let ARC_MAX_STROKE_WEIGHT = [RADIUS / 10, RADIUS / 4];
let ARC_LIFESPAN = [300, 150];
let ARC_LIFESPAN_RANGE = [1, 0];
let ARC_MIN_ANGLE_SPAN_RATIO = [0.25, 1];

//--------------------------------------------------//

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
      color(random(255), random(255), random(255)),
      color(random(255), random(255), random(255)),
      color(random(255), random(255), random(255)),
      color(random(255), random(255), random(255)),
      color(random(255), random(255), random(255)),
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
    this.rayMinLengthRatio = map(
      this.levelOfDetails,
      0,
      1,
      RAY_MIN_LENGTH_RATIO[0],
      RAY_MIN_LENGTH_RATIO[1]
    );

    // arc
    this.arcs = [];
    this.arcPhase = map(this.levelOfDetails, 0, 1, ARC_PHASE[0], ARC_PHASE[1]);
    this.arcPhaseCount = this.arcPhase;
    this.arcMaxStrokeWeight = map(
      this.levelOfDetails,
      0,
      1,
      ARC_MAX_STROKE_WEIGHT[0],
      ARC_MAX_STROKE_WEIGHT[1]
    );
    this.arcLifespan = map(this.bpm, 0, 1, ARC_LIFESPAN[0], ARC_LIFESPAN[1]);
    this.arcLifespanRange = map(
      this.levelOfDetails,
      0,
      1,
      ARC_LIFESPAN_RANGE[0],
      ARC_LIFESPAN_RANGE[1]
    );
    this.arcMinAngleSpanRatio = map(
      this.levelOfDetails,
      0,
      1,
      ARC_MIN_ANGLE_SPAN_RATIO[0],
      ARC_MIN_ANGLE_SPAN_RATIO[1]
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
      this.addRay(
        this.petalColors[int(random(this.petalColors.length))],
        (TWO_PI / this.slices) * ceil(random(this.slices))
      );

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
        petal.display();
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
      this.rayMinLengthRatio,
      this.radius
    );

    this.rays.push(r);
  }

  addArc(color) {
    let a = new Arc(
      color,
      this.radius,
      this.arcMaxStrokeWeight,
      this.arcLifespan,
      this.arcLifespanRange,
      this.arcMinAngleSpanRatio
    );

    this.arcs.push(a);
  }
}

//--------------------------------------------------//

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

    this.isOutward = round(random(1)) == 0 ? true : false;
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
    translate(this.x, 0);
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

//--------------------------------------------------//

class Ray {
  constructor(
    color,
    angle,
    maxLifespan,
    lifespanRange,
    minLengthRatio,
    radius
  ) {
    this.color = color;
    this.angle = angle;

    this.isOutward = round(random(1)) == 0 ? true : false;

    this.lifespan1 =
      maxLifespan *
      constrain(random(1 - lifespanRange / 2, 1 + lifespanRange / 2), 0, 1);
    this.progress1 = this.isOutward ? 0 : this.lifespan1;

    this.lifespan2 =
      maxLifespan *
      constrain(random(1 - lifespanRange / 2, 1 + lifespanRange / 2), 0, 1);
    this.progress2 = this.isOutward ? 0 : this.lifespan2;

    this.isLongest = false;
    this.isDead = false;

    this.radius = radius;
    this.minLength = minLengthRatio * this.radius;
  }

  update() {
    if (this.isOutward) {
      this.x1 = map(
        this.progress1,
        0,
        this.lifespan1,
        0,
        this.radius - this.minLength
      );
      this.x2 = map(
        this.progress2,
        0,
        this.lifespan2,
        0,
        this.radius - this.minLength
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
        this.radius - this.minLength,
        this.radius
      );
      this.x2 = map(
        this.progress2,
        0,
        this.lifespan2,
        this.radius - this.minLength,
        this.radius
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
    stroke(this.color);
    strokeWeight(STROKE_WEIGHT);

    push();
    rotate(this.angle);

    line(this.x1, 0, this.x2, 0);

    pop();
  }
}

//--------------------------------------------------//

class Arc {
  constructor(
    color,
    kRadius,
    maxStrokeWeight,
    maxLifespan,
    lifespanRange,
    minAngleSpanRatio
  ) {
    this.color = color;
    this.radius = random(kRadius);
    this.strokeWeight = random(maxStrokeWeight / 2, maxStrokeWeight);

    this.isClockwise = round(random(1)) == 0 ? true : false;

    this.lifespan1 =
      maxLifespan *
      constrain(random(1 - lifespanRange / 2, 1 + lifespanRange / 2), 0, 1);
    this.progress1 = this.isOutward ? 0 : this.lifespan1;

    this.lifespan2 =
      maxLifespan *
      constrain(random(1 - lifespanRange / 2, 1 + lifespanRange / 2), 0, 1);
    this.progress2 = this.isOutward ? 0 : this.lifespan2;

    this.isLongest = false;
    this.isDead = false;

    this.radius = random(kRadius);
    this.minAngleSpan;
  }

  update() {}
  display() {}
}
