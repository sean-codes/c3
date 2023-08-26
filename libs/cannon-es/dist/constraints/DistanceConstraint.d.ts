import { Constraint } from '../constraints/Constraint';
import { ContactEquation } from '../equations/ContactEquation';
import type { Body } from '../objects/Body';
export declare class DistanceConstraint extends Constraint {
    distance: number;
    distanceEquation: ContactEquation;
    constructor(bodyA: Body, bodyB: Body, distance?: number, maxForce?: number);
    update(): void;
}
