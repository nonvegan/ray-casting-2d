import { Vector } from "./classes.js";

function getMousePosElem(click, xOffset, yOffset) {
  return new Vector(
    click.clientX - click.target.getBoundingClientRect().left - 4 + (typeof xOffset !== "undefined" ? xOffset : 0),
    click.clientY - click.target.getBoundingClientRect().top - 4 + (typeof yOffset !== "undefined" ? yOffset : 0)
  );
}

function restrain(val, min, max) {
  if (val > max) return max;
  if (val < min) return min;
  return val;
}

export { getMousePosElem, restrain };
