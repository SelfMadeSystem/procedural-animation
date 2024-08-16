import { Vec2 } from "./vec2";

export interface Animal {
    resolve(mousePos: Vec2): void;
    display(ctx: CanvasRenderingContext2D): void;
    debugDisplay?(ctx: CanvasRenderingContext2D): void;
}