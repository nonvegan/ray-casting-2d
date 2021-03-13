import { getMousePosElem } from "./helpers.js";
import { Source, Line, Vector, Color } from "./classes.js";

const rayCastingCanvas = document.getElementById("rayCastingCanvas");
const projectionCanvas = document.getElementById("projectionCanvas");
const fovInput = document.getElementById("fovInput");
const nRaysInput = document.getElementById("nRaysInput");
const resetButton = document.getElementById("resetButton");
const randomButton = document.getElementById("randomButton");
const rayCastingCtx = rayCastingCanvas.getContext("2d");
const projectionCtx = projectionCanvas.getContext("2d");
const width = Math.floor(Math.min(window.innerWidth, window.innerHeight) / 2.2);
const height = width;

const source = new Source(width / 2, height / 2, 0, Math.PI / 3, width / 10);
let lineDrawing;
let movementKeys = {
  KeyW: false,
  KeyA: false,
  KeyS: false,
  KeyD: false,
};

function setup() {
  rayCastingCanvas.width = width;
  rayCastingCanvas.height = height;
  projectionCanvas.width = width;
  projectionCanvas.height = height;
  rayCastingCanvas.style.cursor = "crosshair";
  projectionCtx.translate(0, height / 2);
  rayCastingCtx.strokeStyle = "#ffffff";

  rayCastingCanvas.addEventListener("mousedown", (evt) => {
    const randomColor = Color.RANDOM;
    const start = getMousePosElem(evt);
    const mouseMoveHandler = (e) => {
      const end = getMousePosElem(e);
      lineDrawing = new Line(start.x, start.y, end.x, end.y, randomColor);
    };
    const mouseUpHandler = (e) => {
      rayCastingCanvas.removeEventListener("mousemove", mouseMoveHandler);
      rayCastingCanvas.removeEventListener("mouseup", mouseUpHandler);
      if (lineDrawing) {
        source.obstacles.push(lineDrawing);
        lineDrawing = null;
      }
    };
    rayCastingCanvas.addEventListener("mousemove", mouseMoveHandler);
    rayCastingCanvas.addEventListener("mouseup", mouseUpHandler);
  });
  window.addEventListener("keydown", (evt) => {
    if (evt.code in movementKeys) movementKeys[evt.code] = true;
  });
  window.addEventListener("keyup", (evt) => {
    if (evt.code in movementKeys) movementKeys[evt.code] = false;
  });
  fovInput.addEventListener("input", (evt) => (source.fov = (fovInput.value * Math.PI) / 180));
  nRaysInput.addEventListener("input", (evt) => {
    source.nRays = width / (parseInt(nRaysInput.getAttribute("max")) + 1 - nRaysInput.value);
  });
  resetButton.addEventListener("click", reset);
  randomButton.addEventListener("click", generateRandomObstacles);
  setupObstacles();
}

function setupObstacles() {
  source.obstacles = [];
  source.obstacles.push(new Line(0, 0, width, 0, new Color(255, 255, 255)));
  source.obstacles.push(new Line(0, 0, 0, height, new Color(255, 255, 255)));
  source.obstacles.push(new Line(width, 0, width, height, new Color(255, 255, 255)));
  source.obstacles.push(new Line(0, height, width, height, new Color(255, 255, 255)));
}

function generateRandomObstacles() {
  for (let i = 0; i < 5; i++) {
    source.obstacles.push(new Line(Math.random() * width, Math.random() * height, Math.random() * width, Math.random() * height, Color.RANDOM));
  }
}

function clear() {
  rayCastingCtx.clearRect(0, 0, width, height);
  projectionCtx.clearRect(0, -height / 2, width, height);
}

function reset() {
  setupObstacles();
  source.fov = Math.PI / 3;
  fovInput.value = 60;
  source.nRays = width / 10;
  nRaysInput.value = 20;
}

function update() {
  if (movementKeys.KeyW) source.pos.add(new Vector(Math.cos(source.angle), Math.sin(source.angle)));
  if (movementKeys.KeyS) source.pos.sub(new Vector(Math.cos(source.angle), Math.sin(source.angle)));
  if (movementKeys.KeyA) source.angle -= 0.015;
  if (movementKeys.KeyD) source.angle += 0.015;
  source.pos.restrain(5, width - 5, 5, width - 5);
}

function draw() {
  const rayCollisions = source.draw(rayCastingCtx);
  lineDrawing?.draw(rayCastingCtx);
  for (const obstacle of source.obstacles) {
    obstacle.draw(rayCastingCtx);
  }
  for (let i = 0; i < rayCollisions.length; i++) {
    const r = rayCollisions[i];
    const maxDist = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
    let d = (maxDist - r.dist + 10) / maxDist;
    projectionCtx.fillStyle = `rgb(${r.color.r * d},${r.color.g * d},${r.color.b * d})`;
    projectionCtx.fillRect((i / source.nRays) * width, (-d * height) / 2, width / source.nRays, d * height);
  }
}

function animate() {
  clear();
  draw();
  update();
  requestAnimationFrame(animate);
}

setup();
animate();
