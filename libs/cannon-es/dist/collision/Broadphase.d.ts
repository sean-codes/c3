import { Body } from '../objects/Body';
import type { AABB } from '../collision/AABB';
import type { World } from '../world/World';
export declare class Broadphase {
    world: World | null;
    useBoundingBoxes: boolean;
    dirty: boolean;
    static boundingSphereCheck: (bodyA: Body, bodyB: Body) => boolean;
    constructor();
    collisionPairs(world: World, p1: Body[], p2: Body[]): void;
    needBroadphaseCollision(bodyA: Body, bodyB: Body): boolean;
    intersectionTest(bodyA: Body, bodyB: Body, pairs1: Body[], pairs2: Body[]): void;
    doBoundingSphereBroadphase(bodyA: Body, bodyB: Body, pairs1: Body[], pairs2: Body[]): void;
    doBoundingBoxBroadphase(bodyA: Body, bodyB: Body, pairs1: Body[], pairs2: Body[]): void;
    makePairsUnique(pairs1: Body[], pairs2: Body[]): void;
    setWorld(world: World): void;
    aabbQuery(world: World, aabb: AABB, result: Body[]): Body[];
}
