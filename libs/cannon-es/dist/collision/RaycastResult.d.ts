import { Vec3 } from '../math/Vec3';
import type { Body } from '../objects/Body';
import type { Shape } from '../shapes/Shape';
export declare class RaycastResult {
    rayFromWorld: Vec3;
    rayToWorld: Vec3;
    hitNormalWorld: Vec3;
    hitPointWorld: Vec3;
    hasHit: boolean;
    shape: Shape | null;
    body: Body | null;
    hitFaceIndex: number;
    distance: number;
    shouldStop: boolean;
    constructor();
    reset(): void;
    abort(): void;
    set(rayFromWorld: Vec3, rayToWorld: Vec3, hitNormalWorld: Vec3, hitPointWorld: Vec3, shape: Shape, body: Body, distance: number): void;
}
