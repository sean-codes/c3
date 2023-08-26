import { Broadphase } from '../collision/Broadphase';
import type { AABB } from '../collision/AABB';
import type { Body } from '../objects/Body';
import type { World } from '../world/World';
export declare class NaiveBroadphase extends Broadphase {
    constructor();
    collisionPairs(world: World, pairs1: Body[], pairs2: Body[]): void;
    aabbQuery(world: World, aabb: AABB, result?: Body[]): Body[];
}
