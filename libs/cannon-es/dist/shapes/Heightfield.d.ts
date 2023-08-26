import { Shape } from '../shapes/Shape';
import { ConvexPolyhedron } from '../shapes/ConvexPolyhedron';
import { Vec3 } from '../math/Vec3';
import type { AABB } from '../collision/AABB';
import type { Quaternion } from '../math/Quaternion';
export declare type HeightfieldOptions = {
    maxValue?: number | null;
    minValue?: number | null;
    elementSize?: number;
};
declare type HeightfieldPillar = {
    convex: any;
    offset: any;
};
export declare class Heightfield extends Shape {
    data: number[][];
    maxValue: number | null;
    minValue: number | null;
    elementSize: number;
    cacheEnabled: boolean;
    pillarConvex: ConvexPolyhedron;
    pillarOffset: Vec3;
    private _cachedPillars;
    constructor(data: number[][], options?: HeightfieldOptions);
    update(): void;
    updateMinValue(): void;
    updateMaxValue(): void;
    setHeightValueAtIndex(xi: number, yi: number, value: number): void;
    getRectMinMax(iMinX: number, iMinY: number, iMaxX: number, iMaxY: number, result?: number[]): void;
    getIndexOfPosition(x: number, y: number, result: number[], clamp: boolean): boolean;
    getTriangleAt(x: number, y: number, edgeClamp: boolean, a: Vec3, b: Vec3, c: Vec3): boolean;
    getNormalAt(x: number, y: number, edgeClamp: boolean, result: Vec3): void;
    getAabbAtIndex(xi: number, yi: number, { lowerBound, upperBound }: AABB): void;
    getHeightAt(x: number, y: number, edgeClamp: boolean): number;
    getCacheConvexTrianglePillarKey(xi: number, yi: number, getUpperTriangle: boolean): string;
    getCachedConvexTrianglePillar(xi: number, yi: number, getUpperTriangle: boolean): HeightfieldPillar;
    setCachedConvexTrianglePillar(xi: number, yi: number, getUpperTriangle: boolean, convex: ConvexPolyhedron, offset: Vec3): void;
    clearCachedConvexTrianglePillar(xi: number, yi: number, getUpperTriangle: boolean): void;
    getTriangle(xi: number, yi: number, upper: boolean, a: Vec3, b: Vec3, c: Vec3): void;
    getConvexTrianglePillar(xi: number, yi: number, getUpperTriangle: boolean): void;
    calculateLocalInertia(mass: number, target?: Vec3): Vec3;
    volume(): number;
    calculateWorldAABB(pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void;
    updateBoundingSphereRadius(): void;
    setHeightsFromImage(image: HTMLImageElement, scale: Vec3): void;
}
export {};
