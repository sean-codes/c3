import { Broadphase } from '../collision/Broadphase';
import { Vec3 } from '../math/Vec3';
import type { Body } from '../objects/Body';
import type { World } from '../world/World';
export declare class GridBroadphase extends Broadphase {
    nx: number;
    ny: number;
    nz: number;
    aabbMin: Vec3;
    aabbMax: Vec3;
    bins: Body[][];
    binLengths: number[];
    constructor(aabbMin?: Vec3, aabbMax?: Vec3, nx?: number, ny?: number, nz?: number);
    collisionPairs(world: World, pairs1: Body[], pairs2: Body[]): void;
}
