import type { Vec3 } from '../math/Vec3';
import type { Quaternion } from '../math/Quaternion';
import type { Body } from '../objects/Body';
import type { Material } from '../material/Material';
export declare const SHAPE_TYPES: {
    SPHERE: 1;
    PLANE: 2;
    BOX: 4;
    COMPOUND: 8;
    CONVEXPOLYHEDRON: 16;
    HEIGHTFIELD: 32;
    PARTICLE: 64;
    CYLINDER: 128;
    TRIMESH: 256;
};
export declare type ShapeType = typeof SHAPE_TYPES[keyof typeof SHAPE_TYPES];
export declare type ShapeOptions = {
    type?: ShapeType;
    collisionResponse?: boolean;
    collisionFilterGroup?: number;
    collisionFilterMask?: number;
    material?: Material;
};
export declare class Shape {
    id: number;
    type: ShapeType | 0;
    boundingSphereRadius: number;
    collisionResponse: boolean;
    collisionFilterGroup: number;
    collisionFilterMask: number;
    material: Material | null;
    body: Body | null;
    static idCounter: number;
    static types: typeof SHAPE_TYPES;
    constructor(options?: ShapeOptions);
    updateBoundingSphereRadius(): void;
    volume(): number;
    calculateLocalInertia(mass: number, target: Vec3): void;
    calculateWorldAABB(pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void;
}
