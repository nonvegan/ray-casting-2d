import { restrain } from "./helpers.js";

class Source {
  constructor(x, y, angle, fov, nRays) {
    this.pos = new Vector(x, y);
    this.nRays = nRays;
    this.obstacles = [];
    this.fov = fov;
    this.angle = angle;
  }
  draw(ctx) {
    const rayDists = [];
    ctx.save()
    for (let i = 0, angle = this.angle - this.fov / 2; i < this.nRays; i++, angle += this.fov / this.nRays) {
      let ray = new Ray(this.pos.x, this.pos.y, angle);
      for (let obstacle of this.obstacles) {
        ray.checkCollision(obstacle);
      }
      rayDists.push({ dist: this.pos.distance(ray.collPos), color: ray.collColor, angle: ray.ang });
      ray.draw(ctx);
    }
    ctx.restore()
    return rayDists;
  }
}

class Ray {
  constructor(x, y, ang) {
    this.pos = new Vector(x, y);
    this.ang = ang;
    this.collPos = new Vector(Infinity, Infinity);
    this.collColor = new Color(0, 0, 0);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.pos.x, this.pos.y);
    if (this.collPos && isFinite(this.collPos.x) && isFinite(this.collPos.y)) {
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
      this.collColor = obstacle.color;
    }
  }
}

class Line {
  constructor(x1, y1, x2, y2, color) {
    this.start = new Vector(x1, y1);
    this.end = new Vector(x2, y2);
    this.color = color;
  }
  draw(ctx) {
    ctx.save();
    ctx.strokeStyle = this.color.hex();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.end.x, this.end.y);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}

class Color {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
  static get RANDOM() {
    return new Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
  }
  hex() {
    function colorComponent(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }
    return "#" + colorComponent(this.r) + colorComponent(this.g) + colorComponent(this.b);
  }
}
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }
  sub(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }
  restrain(xMin, xMax, yMin, yMax) {
    this.x = restrain(this.x, xMin, xMax);
    this.y = restrain(this.y, yMin, yMax);
  }
  distance(vector) {
    return Math.sqrt(Math.pow(vector.x - this.x, 2) + Math.pow(vector.y - this.y, 2));
  }
}

export { Vector, Source, Line, Color };
