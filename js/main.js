import { getMs, getMousePosElem } from "./helpers.js";
import { Source, Line, Vector } from "./classes.js";

const canvas = document.getElementById("canvas");
const resetButton = document.getElementById("resetButton");
const ctx = canvas.getContext("2d");
const width = Math.min(window.innerWidth, window.innerHeight) / 1.6;
const height = Math.min(window.innerWidth, window.innerHeight) / 1.6;
let obstacles = [];
let lineDrawing;
let source;
let isLerping = false;

function setup() {
  canvas.width = width;
  canvas.height = height;
  canvas.style.cursor = "none";
  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--fuchsia");
  canvas.addEventListener("mouseleave", (evt) => (isLerping = true));
  canvas.addEventListener("mousemove", (evt) => {
    source.pos = getMousePosElem(evt);
    isLerping = false;
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
        obstacles.push(lineDrawing);
        lineDrawing = null;
      }
    };
    canvas.addEventListener("mousemove", mouseMoveHandler);
    canvas.addEventListener("mouseup", mouseUpHandler);
  });
  resetButton.addEventListener("click", setupObstacles, false);

  source = new Source(width / 2, height / 2, 300, obstacles);
  setupObstacles();
}

function setupObstacles() {
  obstacles = [];
  obstacles.push(new Line(0,0,width,0));
  obstacles.push(new Line(0,0,0,height));
  obstacles.push(new Line(width,0,width,height));
  obstacles.push(new Line(0,height,width,height));
  obstacles.push(new Line(0,0,height,0));
  obstacles.push(new Line(Math.random() * width, Math.random() * height, Math.random() * width, Math.random() * height))
  for (let i = 0; i < 4; i++) {
    obstacles.push(new Line(Math.random() * width, Math.random() * height, Math.random() * width, Math.random() * height));
  }
  source.obstacles = obstacles;
}

function clear() {
  ctx.clearRect(0, 0, width, height);
}

function update() {
  if (isLerping) source.pos.lerp(new Vector(width / 2, height / 2), 0.1);
}

function draw() {
  for (const obstacle of obstacles) {
    obstacle.draw(ctx);
  }
  if (lineDrawing) lineDrawing.draw(ctx);
  source.draw(ctx);
}

function animate(){
  clear();
  draw();
  update();
  requestAnimationFrame(animate); 
}

setup();
animate();
