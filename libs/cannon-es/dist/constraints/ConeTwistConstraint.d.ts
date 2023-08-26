import { PointToPointConstraint } from '../constraints/PointToPointConstraint';
import { ConeEquation } from '../equations/ConeEquation';
import { RotationalEquation } from '../equations/RotationalEquation';
import { Vec3 } from '../math/Vec3';
import type { Body } from '../objects/Body';
export declare type ConeTwistConstraintOptions = {
    maxForce?: number;
    pivotA?: Vec3;
    pivotB?: Vec3;
    axisA?: Vec3;
    axisB?: Vec3;
    collideConnected?: boolean;
    angle?: number;
    twistAngle?: number;
};
export declare class ConeTwistConstraint extends PointToPointConstraint {
    axisA: Vec3;
    axisB: Vec3;
    angle: number;
    coneEquation: ConeEquation;
    twistEquation: RotationalEquation;
    twistAngle: number;
    constructor(bodyA: Body, bodyB: Body, options?: ConeTwistConstraintOptions);
    update(): void;
}
