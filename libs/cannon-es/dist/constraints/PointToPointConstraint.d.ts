import { Constraint } from '../constraints/Constraint';
import { ContactEquation } from '../equations/ContactEquation';
import { Vec3 } from '../math/Vec3';
import type { Body } from '../objects/Body';
export declare class PointToPointConstraint extends Constraint {
    pivotA: Vec3;
    pivotB: Vec3;
    equationX: ContactEquation;
    equationY: ContactEquation;
    equationZ: ContactEquation;
    constructor(bodyA: Body, pivotA: Vec3 | undefined, bodyB: Body, pivotB?: Vec3, maxForce?: number);
    update(): void;
}
