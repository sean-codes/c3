import { Equation } from '../equations/Equation';
import { Vec3 } from '../math/Vec3';
import type { Body } from '../objects/Body';
export declare type RotationalEquationOptions = {
    maxForce?: number;
    axisA?: Vec3;
    axisB?: Vec3;
    maxAngle?: number;
};
export declare class RotationalEquation extends Equation {
    axisA: Vec3;
    axisB: Vec3;
    maxAngle: number;
    constructor(bodyA: Body, bodyB: Body, options?: RotationalEquationOptions);
    computeB(h: number): number;
}
