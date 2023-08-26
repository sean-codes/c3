import type { Body } from '../objects/Body';
export declare class ArrayCollisionMatrix {
    matrix: number[];
    constructor();
    get(bi: Body, bj: Body): number;
    set(bi: Body, bj: Body, value: boolean): void;
    reset(): void;
    setNumObjects(n: number): void;
}
