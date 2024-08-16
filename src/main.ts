import { Animal } from "./animal";
import { Fish } from "./fish";
import { random } from "./mathutils";
import { Snake } from "./snake";
import "./style.css";
import { Vec2 } from "./vec2";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const canvasSize = new Vec2(canvas.width, canvas.height);

window.addEventListener("resize", () => {
  canvasSize.x = canvas.width = window.innerWidth;
  canvasSize.y = canvas.height = window.innerHeight;
});

const mousePos = new Vec2(0, 0);

canvas.addEventListener("mousemove", (e) => {
  mousePos.x = e.offsetX;
  mousePos.y = e.offsetY;
});

// const animal = new Snake(new Vec2(canvas.width / 2, canvas.height / 2), 32);
const animals: Animal[] = new Array(10)
  .fill(0)
  .map(
    () =>
      new Fish(new Vec2(canvas.width, canvas.height).mult(Vec2.random()), random(0.05, 0.5))
  )
  .sort((a, b) => a.eh - b.eh);

let prevDeltas: number[] = [];
let prevTime = performance.now();
function averageDelta() {
  return prevDeltas.reduce((acc, curr) => acc + curr, 0) / prevDeltas.length;
}

function getFps() {
  const currentTime = performance.now();
  const dt = currentTime - prevTime;
  prevDeltas.push(dt);

  if (prevDeltas.length > 10) {
    prevDeltas.shift();
  }

  prevTime = currentTime;
  return 1000 / averageDelta();
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  for (const animal of animals) {
    animal.resolve(mousePos);
    animal.display(ctx);
  }
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "white";

  ctx.font = "24px sans-serif";

  ctx.fillText(`FPS: ${getFps().toFixed(2)}`, 10, 30);

  requestAnimationFrame(update);
}

update();
