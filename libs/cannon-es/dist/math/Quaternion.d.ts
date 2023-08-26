import { Vec3 } from '../math/Vec3';
export declare class Quaternion {
    x: number;
    y: number;
    z: number;
    w: number;
    constructor(x?: number, y?: number, z?: number, w?: number);
    set(x: number, y: number, z: number, w: number): Quaternion;
    toString(): string;
    toArray(): [number, number, number, number];
    setFromAxisAngle(vector: Vec3, angle: number): Quaternion;
    toAxisAngle(targetAxis?: Vec3): [Vec3, number];
    setFromVectors(u: Vec3, v: Vec3): Quaternion;
    mult(quat: Quaternion, target?: Quaternion): Quaternion;
    inverse(target?: Quaternion): Quaternion;
    conjugate(target?: Quaternion): Quaternion;
    normalize(): Quaternion;
    normalizeFast(): Quaternion;
    vmult(v: Vec3, target?: Vec3): Vec3;
    copy(quat: Quaternion): Quaternion;
    toEuler(target: Vec3, order?: string): void;
    setFromEuler(x: number, y: number, z: number, order?: string): Quaternion;
    clone(): Quaternion;
    slerp(toQuat: Quaternion, t: number, target?: Quaternion): Quaternion;
    integrate(angularVelocity: Vec3, dt: number, angularFactor: Vec3, target?: Quaternion): Quaternion;
}
