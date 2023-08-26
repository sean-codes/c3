import { Equation } from '../equations/Equation';
import { Vec3 } from '../math/Vec3';
import type { Body } from '../objects/Body';
export declare class FrictionEquation extends Equation {
    ri: Vec3;
    rj: Vec3;
    t: Vec3;
    constructor(bodyA: Body, bodyB: Body, slipForce: number);
    computeB(h: number): number;
}
