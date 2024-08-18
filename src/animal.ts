import { Vec2 } from "./vec2";

export interface Animal {
    resolve(mousePos: Vec2, dt: number): void;
    display(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
    debugDisplay(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
}