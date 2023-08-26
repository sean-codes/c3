import { Vec3 } from '../math/Vec3';
import { Equation } from '../equations/Equation';
import type { Body } from '../objects/Body';
export declare type ConeEquationOptions = {
    maxForce?: number;
    axisA?: Vec3;
    axisB?: Vec3;
    angle?: number;
};
export declare class ConeEquation extends Equation {
    axisA: Vec3;
    axisB: Vec3;
    angle: number;
    constructor(bodyA: Body, bodyB: Body, options?: ConeEquationOptions);
    computeB(h: number): number;
}
