import { PointToPointConstraint } from '../constraints/PointToPointConstraint';
import { RotationalEquation } from '../equations/RotationalEquation';
import { RotationalMotorEquation } from '../equations/RotationalMotorEquation';
import { Vec3 } from '../math/Vec3';
import type { Body } from '../objects/Body';
export declare type HingeConstraintOptions = {
    maxForce?: number;
    pivotA?: Vec3;
    pivotB?: Vec3;
    axisA?: Vec3;
    axisB?: Vec3;
    collideConnected?: boolean;
};
export declare class HingeConstraint extends PointToPointConstraint {
    axisA: Vec3;
    axisB: Vec3;
    rotationalEquation1: RotationalEquation;
    rotationalEquation2: RotationalEquation;
    motorEquation: RotationalMotorEquation;
    constructor(bodyA: Body, bodyB: Body, options?: HingeConstraintOptions);
    enableMotor(): void;
    disableMotor(): void;
    setMotorSpeed(speed: number): void;
    setMotorMaxForce(maxForce: number): void;
    update(): void;
}
