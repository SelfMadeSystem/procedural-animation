import { constrainAngle, constrainDistance } from "./mathutils";
import { Vec2 } from "./vec2";

export class Chain {
  public joints: Array<Vec2>;
  /** Space between joints */
  public linkSize: number;

  // Only used in non-FABRIK resolution
  public angles: Array<number>;
  /** Max angle diff between two adjacent joints, higher = loose, lower = rigid */
  public angleConstraint: number;

  constructor(
    origin: Vec2,
    jointCount: number,
    linkSize: number,
    angleConstraint: number = Math.PI * 2
  ) {
    this.linkSize = linkSize;
    this.angleConstraint = angleConstraint;
    this.joints = []; // Assumed to be >= 2, otherwise it wouldn't be much of a chain
    this.angles = [];
    this.joints.push(origin.clone());
    this.angles.push(0);
    for (let i = 1; i < jointCount; i++) {
      this.joints.push(this.joints[i - 1].add(new Vec2(0, this.linkSize)));
      this.angles.push(0);
    }
  }

  moveTowards(
    pos: Vec2,
    {
      speed = 4,
      accelDistance = 1,
      stopDist = 0,
      maxAngleDiff = this.angleConstraint,
      scale = 1,
    }: {
      speed?: number;
      accelDistance?: number;
      stopDist?: number;
      maxAngleDiff?: number;
      scale?: number;
    }
  ) {
    speed *= scale;
    accelDistance *= scale;
    stopDist *= scale;
    const distance = pos.distanceTo(this.joints[0]);

    if (distance < stopDist) {
      return;
    }

    const angle = constrainAngle(
      pos.sub(this.joints[0]).heading(),
      this.angles[0],
      maxAngleDiff * Math.min(distance / accelDistance, 1)
    );

    const targetPos = this.joints[0].add(
      Vec2.fromAngle(angle).setMag(
        Math.min(distance / accelDistance, speed)
      )
    );

    this.resolve(targetPos);
  }

  resolve(pos: Vec2) {
    this.angles[0] = pos.sub(this.joints[0]).heading();
    this.joints[0] = pos;
    for (let i = 1; i < this.joints.length; i++) {
      let curAngle = this.joints[i - 1].sub(this.joints[i]).heading();
      this.angles[i] = constrainAngle(
        curAngle,
        this.angles[i - 1],
        this.angleConstraint
      );
      this.joints[i] = this.joints[i - 1].sub(
        Vec2.fromAngle(this.angles[i]).setMag(this.linkSize)
      );
    }
  }

  fabrikResolve(pos: Vec2, anchor: Vec2) {
    // Forward pass
    this.joints[0] = pos;
    for (let i = 1; i < this.joints.length; i++) {
      this.joints[i] = constrainDistance(
        this.joints[i],
        this.joints[i - 1],
        this.linkSize
      );
    }

    // Backward pass
    this.joints[this.joints.length - 1] = anchor;
    for (let i = this.joints.length - 2; i >= 0; i--) {
      this.joints[i] = constrainDistance(
        this.joints[i],
        this.joints[i + 1],
        this.linkSize
      );
    }
  }

  display(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 8;
    ctx.strokeStyle = "rgb(255, 255, 255)";
    for (let i = 0; i < this.joints.length - 1; i++) {
      const startJoint = this.joints[i];
      const endJoint = this.joints[i + 1];
      ctx.beginPath();
      ctx.moveTo(startJoint.x, startJoint.y);
      ctx.lineTo(endJoint.x, endJoint.y);
      ctx.stroke();
    }

    ctx.fillStyle = "rgb(42, 44, 53)";
    for (const joint of this.joints) {
      ctx.beginPath();
      ctx.arc(joint.x, joint.y, 16, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  getPos(
    i: number,
    angleOffset: number,
    bodyWidth: number
  ): Vec2 {
    return new Vec2(
      this.joints[i].x +
        Math.cos(this.angles[i] + angleOffset) * (bodyWidth),
      this.joints[i].y +
        Math.sin(this.angles[i] + angleOffset) * (bodyWidth)
    );
  }
}
