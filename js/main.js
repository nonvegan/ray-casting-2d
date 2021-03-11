import { getMousePosElem } from "./helpers.js";
import { Source, Line, Vector } from "./classes.js";

const canvas = document.getElementById("canvas");
const resetButton = document.getElementById("resetButton");
const ctx = canvas.getContext("2d");
const width = Math.min(window.innerWidth, window.innerHeight) / 1.6;
const height = Math.min(window.innerWidth, window.innerHeight) / 1.6;
const source = new Source(width / 2, height / 2, 250);
let lineDrawing,
  isOutOfCanvas = false;

function setup() {
  canvas.width = width;
  canvas.height = height;
  canvas.style.cursor = "none";
  ctx.strokeStyle = "#f92672";
  ctx.globalAlpha = 0.5;
  canvas.addEventListener("mouseleave", (evt) => (isOutOfCanvas = true));
  canvas.addEventListener("mousemove", (evt) => {
    source.pos = getMousePosElem(evt);
    isOutOfCanvas = false;
  });
  canvas.addEventListener("mousedown", (evt) => {
    const start = getMousePosElem(evt);
    const mouseMoveHandler = (e) => {
      const end = getMousePosElem(e);
      lineDrawing = new Line(start.x, start.y, end.x, end.y);
    };
    const mouseUpHandler = (e) => {
      canvas.removeEventListener("mousemove", mouseMoveHandler);
      canvas.removeEventListener("mouseup", mouseUpHandler);
      if (lineDrawing) {
        source.obstacles.push(lineDrawing);
        lineDrawing = null;
      }
    };
    canvas.addEventListener("mousemove", mouseMoveHandler);
    canvas.addEventListener("mouseup", mouseUpHandler);
  });
  resetButton.addEventListener("click", setupObstacles);
  setupObstacles();
}

function setupObstacles() {
  source.obstacles = [];
  source.obstacles.push(new Line(0, 0, width, 0));
  source.obstacles.push(new Line(0, 0, 0, height));
  source.obstacles.push(new Line(width, 0, width, height));
  source.obstacles.push(new Line(0, height, width, height));
  for (let i = 0; i < 4; i++) {
    source.obstacles.push(new Line(Math.random() * width, Math.random() * height, Math.random() * width, Math.random() * height));
  }
}

function clear() {
  ctx.clearRect(0, 0, width, height);
}

function update() {
  if (isOutOfCanvas) source.pos.lerp(new Vector(width / 2, height / 2), 0.1);
}

function draw() {
  for (const obstacle of source.obstacles) {
    obstacle.draw(ctx);
  }
  lineDrawing?.draw(ctx);
  source.draw(ctx);
}

function animate() {
  clear();
  draw();
  update();
  requestAnimationFrame(animate);
}

setup();
animate();
