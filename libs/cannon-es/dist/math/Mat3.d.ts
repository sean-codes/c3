import { Vec3 } from '../math/Vec3';
import type { Quaternion } from '../math/Quaternion';
export declare class Mat3 {
    elements: number[];
    constructor(elements?: number[]);
    identity(): void;
    setZero(): void;
    setTrace(vector: Vec3): void;
    getTrace(target?: Vec3): void;
    vmult(v: Vec3, target?: Vec3): Vec3;
    smult(s: number): void;
    mmult(matrix: Mat3, target?: Mat3): Mat3;
    scale(vector: Vec3, target?: Mat3): Mat3;
    solve(b: Vec3, target?: Vec3): Vec3;
    e(row: number, column: number): number;
    e(row: number, column: number, value: number): void;
    copy(matrix: Mat3): Mat3;
    toString(): string;
    reverse(target?: Mat3): Mat3;
    setRotationFromQuaternion(q: Quaternion): Mat3;
    transpose(target?: Mat3): Mat3;
}
