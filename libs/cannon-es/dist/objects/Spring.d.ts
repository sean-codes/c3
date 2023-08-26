import { Vec3 } from '../math/Vec3';
import type { Body } from '../objects/Body';
export declare type SpringOptions = {
    restLength?: number;
    stiffness?: number;
    damping?: number;
    localAnchorA?: Vec3;
    localAnchorB?: Vec3;
    worldAnchorA?: Vec3;
    worldAnchorB?: Vec3;
};
export declare class Spring {
    restLength: number;
    stiffness: number;
    damping: number;
    bodyA: Body;
    bodyB: Body;
    localAnchorA: Vec3;
    localAnchorB: Vec3;
    constructor(bodyA: Body, bodyB: Body, options?: SpringOptions);
    setWorldAnchorA(worldAnchorA: Vec3): void;
    setWorldAnchorB(worldAnchorB: Vec3): void;
    getWorldAnchorA(result: Vec3): void;
    getWorldAnchorB(result: Vec3): void;
    applyForce(): void;
}
