import { Shape } from '../shapes/Shape';
import { Vec3 } from '../math/Vec3';
import type { Quaternion } from '../math/Quaternion';
export declare class Plane extends Shape {
    worldNormal: Vec3;
    worldNormalNeedsUpdate: boolean;
    boundingSphereRadius: number;
    constructor();
    computeWorldNormal(quat: Quaternion): void;
    calculateLocalInertia(mass: number, target?: Vec3): Vec3;
    volume(): number;
    calculateWorldAABB(pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void;
    updateBoundingSphereRadius(): void;
}
