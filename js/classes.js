class Source {
  constructor(x, y, nRays) {
    this.pos = new Vector(x, y);
    this.nRays = nRays;
  }
  draw(ctx) {
    for (let i = 0, angle = 0; i < this.nRays; i++, angle += (2 * Math.PI) / this.nRays) {
      let ray = new Ray(this.pos.x, this.pos.y, angle);
      for (let obstacle of this.obstacles) {
        ray.checkCollision(obstacle);
      }
      ray.draw(ctx);
    }
  }
}

class Ray {
  constructor(x, y, ang) {
    this.pos = new Vector(x, y);
    this.ang = ang;
    this.collPos = null;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.pos.x, this.pos.y);
    if (this.collPos) {
      ctx.lineTo(this.collPos.x, this.collPos.y);
    } else {
      const maxRayLength = Math.sqrt(Math.pow(ctx.canvas.width, 2) + Math.pow(ctx.canvas.height, 2));
      ctx.lineTo(this.pos.x + Math.cos(this.ang) * maxRayLength, this.pos.y + Math.sin(this.ang) * maxRayLength);
    }
    ctx.closePath();
    ctx.stroke();
  }

  checkCollision(obstacle) {
    let newCollPos;
    switch (obstacle.constructor.name) {
      case "Line":
        const den =
          (this.pos.x - (this.pos.x + Math.cos(this.ang))) * (obstacle.start.y - obstacle.end.y) -
          (this.pos.y - (this.pos.y + Math.sin(this.ang))) * (obstacle.start.x - obstacle.end.x);
        const t =
          ((this.pos.x - obstacle.start.x) * (obstacle.start.y - obstacle.end.y) -
            (this.pos.y - obstacle.start.y) * (obstacle.start.x - obstacle.end.x)) /
          den;
        const u =
          -(
            (this.pos.x - (this.pos.x + Math.cos(this.ang))) * (this.pos.y - obstacle.start.y) -
            (this.pos.y - (this.pos.y + Math.sin(this.ang))) * (this.pos.x - obstacle.start.x)
          ) / den;
        if (t > 0 && u > 0 && u < 1) {
          newCollPos = new Vector(
            this.pos.x + t * (this.pos.x + Math.cos(this.ang) - this.pos.x),
            this.pos.y + t * (this.pos.y + Math.sin(this.ang) - this.pos.y)
          );
        }
        break;
    }
    if (newCollPos && (!this.collPos || (this.collPos && this.pos.distance(newCollPos) < this.pos.distance(this.collPos)))) {
      this.collPos = newCollPos;
    }
  }
}

class Line {
  constructor(x1, y1, x2, y2) {
    this.start = new Vector(x1, y1);
    this.end = new Vector(x2, y2);
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.end.x, this.end.y);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  distance(vector) {
    return Math.sqrt(Math.pow(vector.x - this.x, 2) + Math.pow(vector.y - this.y, 2));
  }
  lerp(vector, t) {
    this.x = this.x * (1 - t) + vector.x * t;
    this.y = this.y * (1 - t) + vector.y * t;
  }
}

export { Vector, Source, Line };
