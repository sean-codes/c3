import { Vec3 } from '../math/Vec3';
import { Body } from '../objects/Body';
import { HingeConstraint } from '../constraints/HingeConstraint';
import type { World } from '../world/World';
export declare type RigidVehicleOptions = {
    coordinateSystem?: Vec3;
    chassisBody?: Body;
};
export declare type RigidVehicleWheelOptions = {
    body?: Body;
    position?: Vec3;
    axis?: Vec3;
};
export declare class RigidVehicle {
    wheelBodies: Body[];
    coordinateSystem: Vec3;
    chassisBody: Body;
    constraints: (HingeConstraint & {
        motorTargetVelocity?: number;
    })[];
    wheelAxes: Vec3[];
    wheelForces: number[];
    constructor(options?: RigidVehicleOptions);
    addWheel(options?: RigidVehicleWheelOptions): number;
    setSteeringValue(value: number, wheelIndex: number): void;
    setMotorSpeed(value: number, wheelIndex: number): void;
    disableMotor(wheelIndex: number): void;
    setWheelForce(value: number, wheelIndex: number): void;
    applyWheelForce(value: number, wheelIndex: number): void;
    addToWorld(world: World): void;
    private _update;
    removeFromWorld(world: World): void;
    getWheelSpeed(wheelIndex: number): number;
}
