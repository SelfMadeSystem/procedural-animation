import { Animal } from "./animal";
import { Chain } from "./chain";
import { CurveRender } from "./curverender";
import { Vec2 } from "./vec2";

// Wiggly lil dude
export class Snake implements Animal {
  spine: Chain;
  scale: number;
  eh: number = Math.random() * 0.25 + 0.5;

  constructor(origin: Vec2, scale: number) {
    this.spine = new Chain(origin, 48, 64 * scale, Math.PI / 8);
    this.scale = scale;
  }

  resolve(mousePos: Vec2) {
    this.spine.moveTowards(mousePos, { maxAngleDiff: 0.025, scale: this.eh });
  }

  display(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 4 * this.scale;
    ctx.strokeStyle = "white";
    ctx.fillStyle = "rgb(172, 57, 49)";
    const { curve } = CurveRender(ctx);

    // === START BODY ===
    ctx.beginPath();

    ctx.moveTo(...this.getPos(0, Math.PI / 2, 0).a());

    // Right half of the snake
    for (let i = 0; i < this.spine.joints.length; i++) {
      curve(...this.getPos(i, Math.PI / 2, 0).a());
    }

    curve(...this.getPos(47, Math.PI, 0).a());

    // Left half of the snake
    for (let i = this.spine.joints.length - 1; i >= 0; i--) {
      curve(...this.getPos(i, -Math.PI / 2, 0).a());
    }

    // Top of the head (completes the loop)
    curve(...this.getPos(0, -Math.PI / 6, 0).a());
    curve(...this.getPos(0, 0, 0).a());
    curve(...this.getPos(0, Math.PI / 6, 0).a());

    // Some overlap needed because curve requires extra vertices that are not rendered
    curve(...this.getPos(0, Math.PI / 2, 0).a());
    curve(...this.getPos(1, Math.PI / 2, 0).a());
    curve(...this.getPos(2, Math.PI / 2, 0).a());

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // === END BODY ===

    // === START EYES ===
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.ellipse(
      ...this.getPos(0, Math.PI / 2, -18).a(),
      12 * this.scale,
      12 * this.scale,
      0,
      0,
      2 * Math.PI
    );
    ctx.ellipse(
      ...this.getPos(0, -Math.PI / 2, -18).a(),
      12 * this.scale,
      12 * this.scale,
      0,
      0,
      2 * Math.PI
    );
    ctx.fill();
    // === END EYES ===
  }

  debugDisplay(ctx: CanvasRenderingContext2D) {
    this.spine.display(ctx);
  }

  bodyWidth(i: number): number {
    switch (i) {
      case 0:
        return 76 * this.scale;
      case 1:
        return 80 * this.scale;
      default:
        return (64 - i) * this.scale;
    }
  }

  getPos(i: number, angleOffset: number, lengthOffset: number): Vec2 {
    return this.spine.getPos(
      i,
      angleOffset,
      lengthOffset * this.scale + this.bodyWidth(i)
    );
  }
}
