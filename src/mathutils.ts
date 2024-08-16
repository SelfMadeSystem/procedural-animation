import { Hct } from "@material/material-color-utilities";
import { Vec2 } from "./vec2";

const PI = Math.PI;
const TWO_PI = Math.PI * 2;

export function newHCT({
  hue = random(0, 360),
  chroma = random(0, 100),
  tone = random(0, 100),
}) {
  const rgb = Hct.from(hue, chroma, tone).toInt();

  return "#" + rgb.toString(16).slice(2);
}

export function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Constrain the vector to be at a certain range of the anchor
export function constrainDistance(pos: Vec2, anchor: Vec2, constraint: number) {
  return anchor.add(pos.sub(anchor).setMag(constraint));
}

// Constrain the angle to be within a certain range of the anchor
export function constrainAngle(
  angle: number,
  anchor: number,
  constraint: number
) {
  if (Math.abs(relativeAngleDiff(angle, anchor)) <= constraint) {
    return simplifyAngle(angle);
  }

  if (relativeAngleDiff(angle, anchor) > constraint) {
    return simplifyAngle(anchor - constraint);
  }

  return simplifyAngle(anchor + constraint);
}

// i.e. How many radians do you need to turn the angle to match the anchor?
export function relativeAngleDiff(angle: number, anchor: number) {
  // Since angles are represented by values in [0, 2pi), it's helpful to rotate
  // the coordinate space such that PI is at the anchor. That way we don't have
  // to worry about the "seam" between 0 and 2pi.
  angle = simplifyAngle(angle + PI - anchor);
  anchor = PI;

  return anchor - angle;
}

// Simplify the angle to be in the range [0, 2pi)
export function simplifyAngle(angle: number) {
  while (angle >= TWO_PI) {
    angle -= TWO_PI;
  }

  while (angle < 0) {
    angle += TWO_PI;
  }

  return angle;
}
