import { EventTarget } from '../utils/EventTarget';
import { Vec3 } from '../math/Vec3';
import { Mat3 } from '../math/Mat3';
import { Quaternion } from '../math/Quaternion';
import { AABB } from '../collision/AABB';
import type { Shape } from '../shapes/Shape';
import type { Material } from '../material/Material';
import type { World } from '../world/World';
export declare const BODY_TYPES: {
    DYNAMIC: 1;
    STATIC: 2;
    KINEMATIC: 4;
};
export declare type BodyType = typeof BODY_TYPES[keyof typeof BODY_TYPES];
export declare const BODY_SLEEP_STATES: {
    AWAKE: 0;
    SLEEPY: 1;
    SLEEPING: 2;
};
export declare type BodySleepState = typeof BODY_SLEEP_STATES[keyof typeof BODY_SLEEP_STATES];
export declare type BodyOptions = {
    collisionFilterGroup?: number;
    collisionFilterMask?: number;
    collisionResponse?: boolean;
    position?: Vec3;
    velocity?: Vec3;
    mass?: number;
    material?: Material;
    linearDamping?: number;
    type?: BodyType;
    allowSleep?: boolean;
    sleepSpeedLimit?: number;
    sleepTimeLimit?: number;
    quaternion?: Quaternion;
    angularVelocity?: Vec3;
    fixedRotation?: boolean;
    angularDamping?: number;
    linearFactor?: Vec3;
    angularFactor?: Vec3;
    shape?: Shape;
};
export declare class Body extends EventTarget {
    id: number;
    index: number;
    world: World | null;
    preStep: (() => void) | null;
    postStep: (() => void) | null;
    vlambda: Vec3;
    collisionFilterGroup: number;
    collisionFilterMask: number;
    collisionResponse: boolean;
    position: Vec3;
    previousPosition: Vec3;
    interpolatedPosition: Vec3;
    initPosition: Vec3;
    velocity: Vec3;
    initVelocity: Vec3;
    force: Vec3;
    mass: number;
    invMass: number;
    material: Material | null;
    linearDamping: number;
    type: BodyType;
    allowSleep: boolean;
    sleepState: BodySleepState;
    sleepSpeedLimit: number;
    sleepTimeLimit: number;
    timeLastSleepy: number;
    wakeUpAfterNarrowphase: boolean;
    torque: Vec3;
    quaternion: Quaternion;
    initQuaternion: Quaternion;
    previousQuaternion: Quaternion;
    interpolatedQuaternion: Quaternion;
    angularVelocity: Vec3;
    initAngularVelocity: Vec3;
    shapes: Shape[];
    shapeOffsets: Vec3[];
    shapeOrientations: Quaternion[];
    inertia: Vec3;
    invInertia: Vec3;
    invInertiaWorld: Mat3;
    invMassSolve: number;
    invInertiaSolve: Vec3;
    invInertiaWorldSolve: Mat3;
    fixedRotation: boolean;
    angularDamping: number;
    linearFactor: Vec3;
    angularFactor: Vec3;
    aabb: AABB;
    aabbNeedsUpdate: boolean;
    boundingRadius: number;
    wlambda: Vec3;
    static idCounter: number;
    static COLLIDE_EVENT_NAME: 'collide';
    static DYNAMIC: typeof BODY_TYPES['DYNAMIC'];
    static STATIC: typeof BODY_TYPES['STATIC'];
    static KINEMATIC: typeof BODY_TYPES['KINEMATIC'];
    static AWAKE: typeof BODY_SLEEP_STATES['AWAKE'];
    static SLEEPY: typeof BODY_SLEEP_STATES['SLEEPY'];
    static SLEEPING: typeof BODY_SLEEP_STATES['SLEEPING'];
    static wakeupEvent: {
        type: 'wakeup';
    };
    static sleepyEvent: {
        type: 'sleepy';
    };
    static sleepEvent: {
        type: 'sleep';
    };
    constructor(options?: BodyOptions);
    wakeUp(): void;
    sleep(): void;
    sleepTick(time: number): void;
    updateSolveMassProperties(): void;
    pointToLocalFrame(worldPoint: Vec3, result?: Vec3): Vec3;
    vectorToLocalFrame(worldVector: Vec3, result?: Vec3): Vec3;
    pointToWorldFrame(localPoint: Vec3, result?: Vec3): Vec3;
    vectorToWorldFrame(localVector: Vec3, result?: Vec3): Vec3;
    addShape(shape: Shape, _offset?: Vec3, _orientation?: Quaternion): Body;
    updateBoundingRadius(): void;
    computeAABB(): void;
    updateInertiaWorld(force?: boolean): void;
    applyForce(force: Vec3, relativePoint: Vec3): void;
    applyLocalForce(localForce: Vec3, localPoint: Vec3): void;
    applyImpulse(impulse: Vec3, relativePoint: Vec3): void;
    applyLocalImpulse(localImpulse: Vec3, localPoint: Vec3): void;
    updateMassProperties(): void;
    getVelocityAtWorldPoint(worldPoint: Vec3, result: Vec3): Vec3;
    integrate(dt: number, quatNormalize: boolean, quatNormalizeFast: boolean): void;
}
