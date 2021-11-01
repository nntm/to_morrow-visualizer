class Module {
  constructor(index, id, isNew, pos, ins, wea, vis) {
    this.index = index;
    this.id = id;
    this.isNew = isNew;

    this.pos = pos;

    // Module
    this.vertexCount = vis.module.vertex_count;
    this.rotationSpeed = vis.module.rotation_speed;
    this.colors = this.toArray(vis.module.colors);
    this.texture_segmentDivision =
      vis.module.texture.segment_division * this.vertexCount;
    this.texture_strokeWeight = vis.module.texture.stroke_weight;

    // Petals
    this.petals = [];
    this.petal_lifespan = vis.petals.lifespan;
    this.petal_lifespanRange = vis.petals.lifespan_range;
    this.petal_shapeType = vis.petals.shape_type;
    this.petal_opacity = vis.petals.opacity;
    this.petal_phase = vis.petals.phase;
    this.petal_phaseCount = this.petal_phase;
    this.petal_maxSize = vis.petals.max_size;
    this.petal_colors = this.toArray(vis.petals.colors);
    this.petal_currentColorIndex = int(random(this.petal_colors.length));
    this.petal_colorPhase = vis.petals.color_phase;
    this.petal_colorPhaseCount = int(random(this.petal_colorPhase));
    this.petal_rotation = vis.petals.rotation;
    this.petal_direction = vis.petals.direction;
    this.petal_noiseSegmentLength = vis.petals.noise_segment_length;
    this.petal_noisePos = 0;
    this.petal_noiseSegmentShift = vis.petals.noise_segment_shift;

    // Rays
    this.rays = [];
    this.ray_lifespan = vis.rays.lifespan;
    this.ray_lifespanRange = vis.rays.lifespan_range;
    this.ray_phase = vis.rays.phase;
    this.ray_phaseCount = this.ray_phase;
    this.ray_length = vis.rays.length;
    this.ray_multiplier = vis.rays.multiplier;
    this.ray_colors = this.toArray(vis.rays.colors);

    // Arcs
    this.arcs = [];
    this.arc_lifespan = vis.arcs.lifespan;
    this.arc_lifespanRange = vis.arcs.lifespan_range;
    this.arc_opacity = vis.arcs.opacity;
    this.arc_phase = vis.arcs.phase;
    this.arc_phaseCount = this.arc_phase;
    this.arc_colors = this.toArray(vis.arcs.colors);
    this.arc_span = vis.arcs.span;
    this.arc_isClockwise = vis.arcs.is_clockwise;
    this.arc_noiseSegmentLength = vis.arcs.noise_segment_length;

    // Droplets
    //this.droplets = [];
    //this.droplet_lifespan = setDropletLifespan();
    //this.droplet_lifespanRange = setDrople();
    //this.droplet_multiplier = setRayLifespan();
    //this.droplet_colors = setRayLifespan();
  }

  //--------------------------------------------------//

  toArray(jsonArr) {
    let arr = [];

    for (let i = 0; i < jsonArr.length; i++) {
      arr.push(color(jsonArr[i].r, jsonArr[i].g, jsonArr[i].b));
    }

    return arr;
  }

  //--------------------------------------------------//
  //--------------------------------------------------//
  //--------------------------------------------------//

  run() {
    //--------------------------------------------------//
    // Petals
    this.petal_noisePos += this.petal_noiseSegmentShift;

    if (this.petal_phaseCount >= this.petal_phase) {
      let color1 = this.petal_colors[this.petal_currentColorIndex];
      let color2;

      if (this.petal_currentColorIndex < this.petal_colors.length - 1) {
        color2 = this.petal_colors[this.petal_currentColorIndex + 1];
      } else {
        color2 = this.petal_colors[0];
      }

      this.addPetal(
        lerpColor(
          color1,
          color2,
          map(this.petal_colorPhaseCount, 0, this.petal_colorPhase, 0, 1)
        )
      );

      this.petal_phaseCount = 0;
    } else {
      this.petal_phaseCount += FPS_RELATIVE_SPEED;
    }

    if (this.petal_colorPhaseCount >= this.petal_colorPhase) {
      this.petal_colorPhaseCount = 0;

      if (this.petal_currentColorIndex++ >= this.petal_colors.length - 1) {
        this.petal_currentColorIndex = 0;
      }
    } else {
      this.petal_colorPhaseCount += FPS_RELATIVE_SPEED;
    }

    for (let i = this.petals.length - 1; i >= 0; i--) {
      let p = this.petals[i];
      p.update(this.petal_noisePos);

      if (p.isDead) {
        this.petals.splice(i, 1);
      }
    }

    //--------------------------------------------------//
    // Rays
    if (this.ray_phaseCount >= this.ray_phase) {
      for (let i = 0; i < this.ray_multiplier; i++) {
        this.addRay(
          this.ray_colors[int(random(this.ray_colors.length))],
          (TWO_PI / this.texture_segmentDivision) *
            ceil(random(this.texture_segmentDivision))
        );
      }

      this.ray_phaseCount = 0;
    } else {
      this.ray_phaseCount += FPS_RELATIVE_SPEED;
    }

    for (let i = this.rays.length - 1; i >= 0; i--) {
      let r = this.rays[i];
      r.update();

      if (r.isDead) {
        this.rays.splice(i, 1);
      }
    }

    //--------------------------------------------------//
    // Arcs
    if (this.arc_phase >= 0) {
      if (this.arc_phaseCount >= this.arc_phase) {
        this.addArc(
          this.arc_colors[int(random(this.arc_colors.length))],
          (TWO_PI / this.texture_segmentDivision) *
            ceil(random(this.texture_segmentDivision))
        );

        this.arc_phaseCount = 0;
      } else {
        this.arc_phaseCount += FPS_RELATIVE_SPEED;
      }

      for (let i = this.arcs.length - 1; i >= 0; i--) {
        let a = this.arcs[i];
        a.update();

        if (a.isDead) {
          this.arcs.splice(i, 1);
        }
      }
    }
  }

  //--------------------------------------------------//
  //--------------------------------------------------//
  //--------------------------------------------------//

  display() {
    blendMode(SCREEN);

    for (let p of this.petals) {
      for (let i = 0; i < MODULE_VERTEX_COUNT; i++) {
        rotate(TWO_PI / MODULE_VERTEX_COUNT);

        push();
        translate(MODULE_RADIUS / 2, 0);
        rotate(this.petal_direction);

        p.display();

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
    fill(this.colors[this.colors.length - 1]);

    textSize(30);
    textAlign(CENTER, CENTER);

    text(this.index, 0, 0);
  }

  drawEnclosingShape() {
    noFill();
    stroke(this.colors[this.colors.length - 1]);
    strokeWeight(1);

    beginShape();
    for (
      let a = HALF_PI;
      a < TWO_PI + HALF_PI;
      a += TWO_PI / MODULE_VERTEX_COUNT
    ) {
      let sx = cos(a) * MODULE_RADIUS;
      let sy = sin(a) * MODULE_RADIUS;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }

  //--------------------------------------------------//

  addPetal(color) {
    let p = new Petal(
      this.petal_lifespan,
      this.petal_lifespanRange,
      this.petal_shapeType,
      this.petal_opacity,
      this.petal_maxSize,
      color,
      this.petal_rotation,
      this.petal_noiseSegmentLength
    );

    this.petals.push(p);
  }

  addRay(color, segment) {
    let r = new Ray(
      this.ray_lifespan,
      this.ray_lifespanRange,
      this.ray_length,
      color,
      segment,
      this.texture_strokeWeight
    );

    this.rays.push(r);
  }

  addArc(color, segment) {
    let a = new Arc(
      this.arc_lifespan,
      this.arc_lifespanRange,
      this.arc_opacity,
      color,
      segment,
      this.arc_span,
      this.arc_isClockwise,
      this.texture_strokeWeight
    );

    this.arcs.push(a);
  }
}
