class Module {
    constructor(index, id, isNew, pos, ins, wea, vis) {
        this.isPaused = false;

        this.index = index;
        this.id = id;
        this.isNew = isNew;

        this.pos = pos;

        this.username = ins.username;
        this.timestamp = ins.taken_at;

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
        this.droplets = [];
        this.DROPLET_LIFESPAN = [45, 30];

        this.droplet_lifespan = vis.droplets.lifespan;
        this.droplet_lifespanRange = vis.droplets.lifespan_range;
        this.droplet_colors = vis.droplets.colors;

        this.droplet_phase = map(
            this.droplet_lifespan,
            this.DROPLET_LIFESPAN[0],
            this.DROPLET_LIFESPAN[1],
            25,
            1
        );
        this.droplet_phaseCount = this.droplet_phase;
        this.droplet_opacity = this.arc_opacity;
        this.droplet_maxRadius = map(
            this.droplet_lifespan,
            this.DROPLET_LIFESPAN[0],
            this.DROPLET_LIFESPAN[1],
            0.05,
            0.75
        );

        // Tooltip
        this.TOOLTIP_TRANSFORM_Y = -20;
        this.TOOLTIP_MAX_WIDTH = 200;
        this.TOOLTIP_MAX_HEIGHT = 70;
        this.TOOLTIP_TIP_WIDTH = 16;
        this.TOOLTIP_TIP_HEIGHT = 8;
        this.TOOLTIP_CORNER_RADIUS = 10;
        this.TOOLTIP_PADDING = 10;
        this.TOOLTIP_BACKGROUND_COLOR = 255;
        this.TOOLTIP_BACKGROUND_OPACITY = 0.9;
        this.TOOLTIP_TEXT_COLOR = 0;
        this.TOOLTIP_TEXT_SIZE_RECUSRIVE = 12;
        this.TOOLTIP_TEXT_SIZE_NEWSREADER = 15;

        this.TOOLTIP_ID = "Outlook " + this.id.toUpperCase();
        this.TOOLTIP_USERNAME = (function (
            username,
            textSize,
            maxWidth,
            padding
        ) {
            textFont(newsreader, textSize);
            let str = "@" + username;
            let isTrimmed = false;

            while (textWidth(str + "…") > maxWidth - padding * 2) {
                str = str.substring(0, str.length - 1);
                isTrimmed = true;
            }

            if (!isTrimmed) return str;
            else return str + "…";
        })(
            this.username,
            this.TOOLTIP_TEXT_SIZE_NEWSREADER,
            this.TOOLTIP_MAX_WIDTH,
            this.TOOLTIP_PADDING
        );
        this.TOOLTIP_TIMESTAMP = (function (timestamp) {
            let DATE_SEPARATOR = "/";
            let TIME_SEPARATOR = ":";
            return (
                dd(timestamp) +
                DATE_SEPARATOR +
                mm(timestamp) +
                DATE_SEPARATOR +
                yy(timestamp) +
                "  " +
                h(timestamp) +
                TIME_SEPARATOR +
                m(timestamp) +
                TIME_SEPARATOR +
                s(timestamp) +
                " GMT+7"
            );
        })(this.timestamp * 1000);
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

    pauseModule() {
        this.isPaused = true;
    }

    //--------------------------------------------------//

    resumeModule() {
        this.isPaused = false;
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
                    map(
                        this.petal_colorPhaseCount,
                        0,
                        this.petal_colorPhase,
                        0,
                        1
                    )
                )
            );

            this.petal_phaseCount = 0;
        } else {
            this.petal_phaseCount += FPS_RELATIVE_SPEED;
        }

        if (this.petal_colorPhaseCount >= this.petal_colorPhase) {
            this.petal_colorPhaseCount = 0;

            if (
                this.petal_currentColorIndex++ >=
                this.petal_colors.length - 1
            ) {
                this.petal_currentColorIndex = 0;
            }
        } else {
            this.petal_colorPhaseCount += FPS_RELATIVE_SPEED;
        }

        for (let i = this.petals.length - 1; i >= 0; i--) {
            let p = this.petals[i];

            if (!p.isDead) {
                p.update(this.petal_noisePos);
            } else {
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

            if (!r.isDead) {
                r.update();
            } else {
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

                if (!a.isDead) {
                    a.update();
                } else {
                    this.arcs.splice(i, 1);
                }
            }
        }

        //--------------------------------------------------//
        // Droplets
        if (this.droplet_lifespan >= 0) {
            if (this.droplet_phaseCount >= this.droplet_phase) {
                this.addDroplet(
                    this.droplet_colors[
                        int(random(this.droplet_colors.length))
                    ],
                    (TWO_PI / this.texture_segmentDivision) *
                        ceil(random(this.texture_segmentDivision))
                );

                this.droplet_phaseCount = 0;
            } else {
                this.droplet_phaseCount += FPS_RELATIVE_SPEED;
            }

            for (let i = this.droplets.length - 1; i >= 0; i--) {
                let d = this.droplets[i];

                if (!d.isDead) {
                    d.update();
                } else {
                    this.droplets.splice(i, 1);
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
            if (!p.isDead) {
                for (let i = 0; i < MODULE_VERTEX_COUNT; i++) {
                    rotate(TWO_PI / MODULE_VERTEX_COUNT);

                    push();
                    translate(MODULE_RADIUS / 2.0, 0);
                    rotate(this.petal_direction);

                    p.display();

                    pop();
                }
            }
        }

        for (let r of this.rays) {
            if (!r.isDead) r.display();
        }

        for (let a of this.arcs) {
            if (!a.isDead) a.display();
        }

        for (let d of this.droplets) {
            if (!d.isDead) d.display();
        }
    }

    //--------------------------------------------------//
    //--------------------------------------------------//
    //--------------------------------------------------//

    drawMetadataTooltip() {
        colorMode(RGB, 255, 255, 255, 1);

        push();
        translate(0, -(this.TOOLTIP_MAX_HEIGHT / 2 + MODULE_RADIUS + 10));

        // Draw: Background
        rectMode(CENTER);
        fill(this.TOOLTIP_BACKGROUND_COLOR, this.TOOLTIP_BACKGROUND_OPACITY);
        noStroke();
        rect(
            0,
            0,
            this.TOOLTIP_MAX_WIDTH,
            this.TOOLTIP_MAX_HEIGHT,
            this.TOOLTIP_CORNER_RADIUS
        );

        // Draw: Tip
        fill(this.TOOLTIP_BACKGROUND_COLOR, this.TOOLTIP_BACKGROUND_OPACITY);
        noStroke();
        push();
        translate(0, this.TOOLTIP_MAX_HEIGHT / 2);
        triangle(
            -this.TOOLTIP_TIP_WIDTH / 2,
            0,
            this.TOOLTIP_TIP_WIDTH / 2,
            0,
            0,
            this.TOOLTIP_TIP_HEIGHT
        );
        pop();

        // Draw: Outlook ID
        noStroke();
        fill(this.TOOLTIP_TEXT_COLOR);
        textAlign(CENTER, TOP);
        textFont(recursive, this.TOOLTIP_TEXT_SIZE_RECUSRIVE);
        text(
            this.TOOLTIP_ID,
            0,
            -this.TOOLTIP_MAX_HEIGHT / 2 + this.TOOLTIP_PADDING
        );

        // Draw: Username
        noStroke();
        fill(this.TOOLTIP_TEXT_COLOR);
        textAlign(CENTER, CENTER);
        textFont(newsreader, this.TOOLTIP_TEXT_SIZE_NEWSREADER);
        text(this.TOOLTIP_USERNAME, 0, -1.5);

        // Draw: Timestamp
        noStroke();
        fill(this.TOOLTIP_TEXT_COLOR);
        textAlign(CENTER, BOTTOM);
        textFont(recursive, this.TOOLTIP_TEXT_SIZE_RECUSRIVE);
        text(
            this.TOOLTIP_TIMESTAMP,
            0,
            this.TOOLTIP_MAX_HEIGHT / 2 - this.TOOLTIP_PADDING
        );

        pop();
    }

    //--------------------------------------------------//

    drawIndex() {
        noStroke();
        fill(255);

        textSize(MODULE_RADIUS * 0.5);
        textAlign(CENTER, CENTER);

        text(this.index, 0, 0);
    }

    //--------------------------------------------------//

    drawEnclosingShape() {
        noFill();
        stroke(255);
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

        ellipse(0, 0, MODULE_RADIUS * 2, MODULE_RADIUS * 2);
    }

    //--------------------------------------------------//
    //--------------------------------------------------//
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

    addDroplet(color, segment) {
        let d = new Droplet(
            this.droplet_lifespan,
            this.droplet_lifespanRange,
            color,
            segment,
            this.droplet_opacity,
            this.texture_strokeWeight,
            this.droplet_maxRadius
        );

        this.droplets.push(d);
    }
}
