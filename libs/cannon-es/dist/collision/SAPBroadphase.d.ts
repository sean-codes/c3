import { Broadphase } from '../collision/Broadphase';
import type { AABB } from '../collision/AABB';
import type { Body } from '../objects/Body';
import type { World } from '../world/World';
export declare class SAPBroadphase extends Broadphase {
    axisList: Body[];
    world: World | null;
    axisIndex: 0 | 1 | 2;
    private _addBodyHandler;
    private _removeBodyHandler;
    static checkBounds: (bi: Body, bj: Body, axisIndex: 0 | 1 | 2) => boolean;
    static insertionSortX: (a: Body[]) => Body[];
    static insertionSortY: (a: Body[]) => Body[];
    static insertionSortZ: (a: Body[]) => Body[];
    constructor(world: World);
    setWorld(world: World): void;
    collisionPairs(world: World, p1: Body[], p2: Body[]): void;
    sortList(): void;
    autoDetectAxis(): void;
    aabbQuery(world: World, aabb: AABB, result?: Body[]): Body[];
}
