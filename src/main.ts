import { Snake } from "./snake";
import "./style.css";
import { Vec2 } from "./vec2";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const canvasSize = new Vec2(canvas.width, canvas.height);

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  canvasSize.x = canvas.width;
  canvasSize.y = canvas.height;
});

const mousePos = new Vec2(0, 0);

canvas.addEventListener("mousemove", (e) => {
  mousePos.x = e.offsetX;
  mousePos.y = e.offsetY;
});

const snake = new Snake(new Vec2(canvas.width / 2, canvas.height / 2), 32);

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.resolve(mousePos);
  snake.display(ctx);

  requestAnimationFrame(update);
}

update();
