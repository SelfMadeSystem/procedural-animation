import { Chain } from "./chain";
import { CurveRender } from "./curverender";
import { Vec2 } from "./vec2";

// Wiggly lil dude
export class Snake {
  spine: Chain;

  constructor(origin: Vec2, linkSize: number) {
    this.spine = new Chain(origin, 48, linkSize, Math.PI / 8);
  }

  resolve(mousePos: Vec2) {
    this.spine.moveTowards(mousePos, { maxAngleDiff: 0.025 });
  }

  display(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 4;
    ctx.strokeStyle = "white";
    ctx.fillStyle = "rgb(172, 57, 49)";
    const curveVertex = CurveRender(ctx);

    // === START BODY ===
    ctx.beginPath();

    // Right half of the snake
    for (let i = 0; i < this.spine.joints.length; i++) {
      curveVertex(...this.getPos(i, Math.PI / 2, 0).a());
    }

    curveVertex(...this.getPos(47, Math.PI, 0).a());

    // Left half of the snake
    for (let i = this.spine.joints.length - 1; i >= 0; i--) {
      curveVertex(...this.getPos(i, -Math.PI / 2, 0).a());
    }

    // Top of the head (completes the loop)
    curveVertex(...this.getPos(0, -Math.PI / 6, 0).a());
    curveVertex(...this.getPos(0, 0, 0).a());
    curveVertex(...this.getPos(0, Math.PI / 6, 0).a());

    // Some overlap needed because curveVertex requires extra vertices that are not rendered
    curveVertex(...this.getPos(0, Math.PI / 2, 0).a());
    curveVertex(...this.getPos(1, Math.PI / 2, 0).a());
    curveVertex(...this.getPos(2, Math.PI / 2, 0).a());

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // === END BODY ===

    // === START EYES ===
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.ellipse(
      ...this.getPos(0, Math.PI / 2, -18).a(),
      12 * this.spine.linkSize / 64,
      12 * this.spine.linkSize / 64,
      0,
      0,
      2 * Math.PI
    );
    ctx.ellipse(
      ...this.getPos(0, -Math.PI / 2, -18).a(),
      12 * this.spine.linkSize / 64,
      12 * this.spine.linkSize / 64,
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
        return (76 * this.spine.linkSize) / 64;
      case 1:
        return (80 * this.spine.linkSize) / 64;
      default:
        return ((64 - i) * this.spine.linkSize) / 64;
    }
  }

  getPos(i: number, angleOffset: number, lengthOffset: number): Vec2 {
    return this.spine.getPos(i, angleOffset, lengthOffset, this.bodyWidth(i));
  }
}
