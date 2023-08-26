import { Shape } from '../shapes/Shape';
import { Vec3 } from '../math/Vec3';
import { ConvexPolyhedron } from '../shapes/ConvexPolyhedron';
import type { Quaternion } from '../math/Quaternion';
export declare class Box extends Shape {
    halfExtents: Vec3;
    convexPolyhedronRepresentation: ConvexPolyhedron;
    static calculateInertia: (halfExtents: Vec3, mass: number, target: Vec3) => void;
    constructor(halfExtents: Vec3);
    updateConvexPolyhedronRepresentation(): void;
    calculateLocalInertia(mass: number, target?: Vec3): Vec3;
    getSideNormals(sixTargetVectors: Vec3[], quat: Quaternion): Vec3[];
    volume(): number;
    updateBoundingSphereRadius(): void;
    forEachWorldCorner(pos: Vec3, quat: Quaternion, callback: (x: number, y: number, z: number) => void): void;
    calculateWorldAABB(pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void;
}
