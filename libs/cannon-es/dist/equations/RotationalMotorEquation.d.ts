import { Equation } from '../equations/Equation';
import { Vec3 } from '../math/Vec3';
import type { Body } from '../objects/Body';
export declare class RotationalMotorEquation extends Equation {
    axisA: Vec3;
    axisB: Vec3;
    targetVelocity: number;
    constructor(bodyA: Body, bodyB: Body, maxForce?: number);
    computeB(h: number): number;
}
