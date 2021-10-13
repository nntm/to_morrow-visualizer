let MAX_NOISE_SEED = 10000;

let RADIUS = 20;
let VERTICES = 6;

let STROKE_WEIGHT = RADIUS / 50;

let PETAL_SHAPE_TYPE = ["RECT", "ELLIPSE", "TRIANGLE", "DIAMOND"];
let PETAL_OPACITY = [0.8, 0.4];
let PETAL_PHASE = [120, 45];
let PETAL_MAX_SIZE = RADIUS * 0.3;
let PETAL_LIFESPAN = [275, 125];
let PETAL_COLOR_PHASE = [75, 30];
let PETAL_NOISE_SEGMENT = [0.05, 0.4];
let PETAL_NOISE_MAP_INCREMENT = [0.001, 0.008];
let PETAL_ROTATION_SPEED = [0.0005, 0.01];

let SPARKLE_PHASE = [45, 15];
let SPARKLE_MAX_RADIUS = [20, 70];
let SPARKLE_STROKE_WEIGHT = RADIUS / 80;
let SPARKLE_LIFESPAN = [60, 180];

let TEXTURE_SLICE_DIVISION_MULTIPLIER = [1, 5];
let TEXTURE_RAY_PHASE = [30, 5];
let TEXTURE_RAY_LIFESPAN = [210, 60];
let TEXTURE_ARC_PHASE = [45, 15];

//--------------------------------------------------//

class Module {
  constructor(index, x, y, radius, vertices, maxPetalSize) {
    this.index = index;

    this.posX = x;
    this.posY = y;

    this.radius = radius;
    this.vertices = vertices;
    this.maxPetalSize = maxPetalSize;

    colorMode(RGB, 255, 255, 255);
    this.colors = [
      color(random(255), random(255), random(255)),
      color(random(255), random(255), random(255)),
      color(random(255), random(255), random(255)),
      color(random(255), random(255), random(255)),
    ];

    this.levelOfDetails = random(1);
    this.bpm = random(1);

    // petal
    this.petals = [];
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
    this.petalCurrentColorIndex = 0;
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
    this.petalRotationSpeed = map(
      this.bpm,
      0,
      1,
      PETAL_ROTATION_SPEED[0],
      PETAL_ROTATION_SPEED[1]
    );

    // texture
    this.slices =
      this.vertices *
      round(
        map(
          this.levelOfDetails,
          0,
          1,
          TEXTURE_SLICE_DIVISION_MULTIPLIER[0],
          TEXTURE_SLICE_DIVISION_MULTIPLIER[1]
        )
      );

    // ray
    this.rays = [];
    this.rayPhaseCount = 0;
    this.rayPhase = map(
      this.levelOfDetails,
      0,
      1,
      TEXTURE_RAY_PHASE[0],
      TEXTURE_RAY_PHASE[1]
    );
    this.rayLifespan = map(
      this.bpm,
      0,
      1,
      TEXTURE_RAY_LIFESPAN[0],
      TEXTURE_RAY_LIFESPAN[1]
    );

    // arc
    this.arcs = [];
    this.arcPhaseCount = 0;
    this.arcPhase = map(
      this.levelOfDetails,
      0,
      1,
      TEXTURE_ARC_PHASE[0],
      TEXTURE_ARC_PHASE[1]
    );

    // sparkle
    this.sparkles = [];
    this.sparklePhaseCount = 0;
    this.sparklePhase = map(
      this.levelOfDetails,
      0,
      1,
      SPARKLE_PHASE[0],
      SPARKLE_PHASE[1]
    );
    this.sparkleMaxRadius = map(
      this.levelOfDetails,
      0,
      1,
      SPARKLE_MAX_RADIUS[0],
      SPARKLE_MAX_RADIUS[1]
    );
    this.sparkleLifespan = map(
      this.levelOfDetails,
      0,
      1,
      SPARKLE_LIFESPAN[0],
      SPARKLE_LIFESPAN[1]
    );
  }

  //--------------------------------------------------//

  run() {
    this.noiseSeedMemory = int(random(MAX_NOISE_SEED));
    this.petalNoisePos += this.petalNoiseMapIncrement;

    if (this.petalPhaseCount++ >= this.petalPhase) {
      let color1 = this.colors[this.petalCurrentColorIndex];
      let color2;
      if (this.petalCurrentColorIndex < this.colors.length - 1) {
        color2 = this.colors[this.petalCurrentColorIndex + 1];
      } else {
        color2 = this.colors[0];
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

      if (this.petalCurrentColorIndex++ >= this.colors.length - 1) {
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
    console.log(this.petals.length);

    /*

    if (this.rayPhaseCount++ >= this.rayPhase) {
      this.addRay(
        this.colors[int(random(this.colors.length))],
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

    if (this.sparklePhaseCount++ >= this.sparklePhase) {
      this.addSparkle(
        random(-this.radius, this.radius),
        random(-this.radius, this.radius),
        this.colors[int(random(this.colors.length))]
      );

      this.sparklePhaseCount = 0;
    }

    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      let sparkle = this.sparkles[i];
      sparkle.update();

      if (sparkle.isDead) {
        this.sparkles.splice(i, 1);
      }
    }

    */
  }

  //--------------------------------------------------//

  display() {
    for (let petal of this.petals) {
      for (let i = 0; i < this.vertices; i++) {
        push();
        rotate((TWO_PI * i) / this.vertices);

        petal.display();
        pop();
      }
    }

    /*
    for (let r of this.rays) {
      r.display();
    }

    for (let a of this.arcs) {
      a.display();
    }

    for (let sparkle of this.sparkles) {
      sparkle.display();
    }
    */
  }

  //--------------------------------------------------//

  drawIndex() {
    noStroke();
    fill(this.colors[0]);

    textSize(30);
    textAlign(CENTER, CENTER);

    text(this.index, 0, 0);
  }

  drawEnclosingShape() {
    noFill();
    stroke(this.colors[0]);

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
      this.petalRotationSpeed
    );

    this.petals.push(petal);
  }

  /*

  addRay(color, angle) {
    let r = new Ray(color, angle, this.rayLifespan, this.radius);

    this.rays.push(r);
  }

  addSparkle(x, y, color) {
    let sparkle = new Sparkle(
      x,
      y,
      this.sparkleMaxRadius,
      color,
      this.sparkleLifespan
    );

    this.sparkles.push(sparkle);
  }

  */

  //--------------------------------------------------//

  removePetal() {
    this.petals.length--;
  }

  /*

  removeRay() {
    this.rays.length--;
  }

  removeArc() {
    this.arcs.length--;
  }

  removeSparkle() {
    this.sparkles.length--;
  }

  */
}

//--------------------------------------------------//

class Petal {
  constructor(
    shapeType,
    color,
    opacity,
    kRadius,
    maxSize,
    lifespan,
    noiseSeed,
    noiseSegment,
    rotationSpeed
  ) {
    this.shapeType = shapeType;

    this.x = 0;

    this.color = color;
    this.opacity = opacity;

    this.kRadius = kRadius;

    this.size = 0;
    this.maxSize = maxSize;

    this.outward = round(random(1)) == 0 ? true : false;
    this.lifespan = lifespan;
    this.progress = this.outward ? 0 : lifespan;
    this.isDead = false;

    this.noiseSeedMemory = noiseSeed;
    this.noiseSegment = noiseSegment;

    this.rotationSpeed = rotationSpeed;

    this.randomSineShift = random(PI);
  }

  update(petalNoisePos) {
    noiseSeed(this.noiseSeedMemory);

    this.x = map(this.progress, this.lifespan, 0, 0, 1) * this.kRadius;

    this.width =
      sin(map(this.progress, this.lifespan, 0, 0, PI)) *
      pow(
        noise(
          map(this.progress, this.lifespan, 0, 0, this.noiseSegment),
          petalNoisePos
        ) + 1,
        1.5
      ) *
      this.maxSize;

    this.height =
      sin(map(this.progress, this.lifespan, 0, PI, 0)) *
      pow(
        noise(
          -petalNoisePos,
          -map(this.progress, this.lifespan, 0, 0, this.noiseSegment)
        ) + 1,
        2
      ) *
      this.maxSize;

    if (this.outward) {
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
    blendMode(SCREEN);

    push();
    translate(this.x, 0);
    rotate(frameCount * this.rotationSpeed);

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
        triangle(
          0,
          0,
          this.width,
          -this.height / 2,
          this.width,
          this.height / 2
        );
        break;
      case "DIAMOND":
        triangle(
          this.width / 2,
          -this.height / 2,
          this.width / 2,
          this.height / 2,
          this.width,
          0
        );
        triangle(
          0,
          0,
          this.width / 2,
          -this.height / 2,
          this.width / 2,
          this.height / 2
        );
        break;
    }

    pop();
  }
}

//--------------------------------------------------//

/*

class Ray {
  constructor(color, angle, lifespan, kRadius) {
    this.color = color;
    this.angle = angle;

    this.lifespan = lifespan;
    this.progress = this.lifespan;
    this.isDead = false;

    this.kRadius = kRadius;

    this.x1 = this.kRadius;
    this.x2 = this.kRadius;

    this.randomSineShift = random(PI);
  }

  update() {
    if (this.progress-- >= 0) {
      this.x1 =
        sin(map(this.progress, this.lifespan, 0, HALF_PI, PI)) *
        this.kRadius *
        (sin(map(this.progress, this.lifespan, 0, HALF_PI, PI)) + 1);

      this.x2 =
        sin(map(this.progress, this.lifespan, 0, HALF_PI, PI)) * this.kRadius;
    } else {
      this.isDead = true;
    }
  }

  display() {
    blendMode(SCREEN);
    stroke(this.color);
    strokeWeight(STROKE_WEIGHT);

    push();
    rotate(this.angle);

    line(this.x1, 0, this.x2, 0);

    pop();
  }
}

*/

//--------------------------------------------------//

/*

class Arc {
  constructor() {}

  update() {}

  display() {}
}

*/

//--------------------------------------------------//

/*

class Sparkle {
  constructor(x, y, maxRadius, c, lifespan) {
    this.x = x;
    this.y = y;
    this.radius = random(maxRadius);
    this.lifespan = lifespan;
    this.progress = lifespan;
    this.isDead = false;

    this.opacity = 1;
    colorMode(RGB, 255, 255, 255);
    this.c = color(red(c), green(c), blue(c));
  }

  update() {
    if (this.progress-- >= 0) {
      this.opacity = map(this.progress, this.lifespan, 0, 1, 0);
    } else {
      this.isDead = true;
    }
  }

  display() {
    noFill();
    strokeWeight(SPARKLE_STROKE_WEIGHT);
    stroke(color(red(this.c), green(this.c), blue(this.c), this.opacity));
    stroke(color(255, 255, 255, this.opacity));

    line(this.x - this.radius, this.y, this.x + this.radius, this.y);
    line(this.x, this.y - this.radius, this.x, this.y + this.radius);
  }
}

*/
