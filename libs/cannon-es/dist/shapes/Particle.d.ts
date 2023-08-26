import { Shape } from '../shapes/Shape';
import { Vec3 } from '../math/Vec3';
import type { Quaternion } from '../math/Quaternion';
export declare class Particle extends Shape {
    constructor();
    calculateLocalInertia(mass: number, target?: Vec3): Vec3;
    volume(): number;
    updateBoundingSphereRadius(): void;
    calculateWorldAABB(pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void;
}
