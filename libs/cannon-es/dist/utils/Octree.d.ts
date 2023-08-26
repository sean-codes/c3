import { AABB } from '../collision/AABB';
import type { Transform } from '../math/Transform';
import type { Ray } from '../collision/Ray';
declare class OctreeNode {
    root: OctreeNode | null;
    aabb: AABB;
    data: number[];
    children: OctreeNode[];
    constructor(options?: {
        root?: Octree | null;
        aabb?: AABB;
    });
    reset(): void;
    insert(aabb: AABB, elementData: number, level?: number): boolean;
    subdivide(): void;
    aabbQuery(aabb: AABB, result: number[]): number[];
    rayQuery(ray: Ray, treeTransform: Transform, result: number[]): number[];
    removeEmptyNodes(): void;
}
export declare class Octree extends OctreeNode {
    maxDepth: number;
    constructor(aabb?: AABB, options?: {
        maxDepth?: number;
    });
}
export {};
