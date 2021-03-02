import { getMs, getMousePosElem } from "./helpers.js";
import { Source, Line, Vector } from "./classes.js";

const canvas = document.getElementById("canvas");
const resetButton = document.getElementById("resetButton");
const ctx = canvas.getContext("2d");
const width = Math.min(window.innerWidth, window.innerHeight) / 1.6;
const height = Math.min(window.innerWidth, window.innerHeight) / 1.6;
let obstacles = [];
let source;
let isLerping = false;

function setup() {
  canvas.width = width;
  canvas.height = height;
  canvas.style.cursor = "none";
  canvas.addEventListener("mousemove", (evt) => {
    source.pos = getMousePosElem(evt);
    isLerping = false;
  });
  canvas.addEventListener("mouseleave", (evt) => (isLerping = true));
  resetButton.addEventListener("click", resetObstacles, false);
  ctx.globalAlpha = 0.75;
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--fuchsia");
  source = new Source(width / 2, height / 2, 300, obstacles);
  resetObstacles();
}

function resetObstacles() {
  obstacles = [];
  for (let i = 0; i < 5; i++) {
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
  source.draw(ctx);
}

setup();
setInterval(() => {
  clear();
  draw();
  update();
}, getMs(60));
