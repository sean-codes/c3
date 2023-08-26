import { Equation } from '../equations/Equation';
import { Vec3 } from '../math/Vec3';
import type { Body } from '../objects/Body';
export declare class ContactEquation extends Equation {
    restitution: number;
    ri: Vec3;
    rj: Vec3;
    ni: Vec3;
    constructor(bodyA: Body, bodyB: Body, maxForce?: number);
    computeB(h: number): number;
    getImpactVelocityAlongNormal(): number;
}
