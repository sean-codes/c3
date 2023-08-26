import { PointToPointConstraint } from '../constraints/PointToPointConstraint';
import { RotationalEquation } from '../equations/RotationalEquation';
import { Vec3 } from '../math/Vec3';
import type { Body } from '../objects/Body';
import type { RotationalMotorEquation } from '../equations/RotationalMotorEquation';
export declare type LockConstraintOptions = {
    maxForce?: number;
};
export declare class LockConstraint extends PointToPointConstraint {
    xA: Vec3;
    xB: Vec3;
    yA: Vec3;
    yB: Vec3;
    zA: Vec3;
    zB: Vec3;
    rotationalEquation1: RotationalEquation;
    rotationalEquation2: RotationalEquation;
    rotationalEquation3: RotationalEquation;
    motorEquation?: RotationalMotorEquation;
    constructor(bodyA: Body, bodyB: Body, options?: LockConstraintOptions);
    update(): void;
}
