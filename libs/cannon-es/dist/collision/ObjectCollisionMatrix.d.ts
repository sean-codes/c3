import type { Body } from '../objects/Body';
export declare class ObjectCollisionMatrix {
    matrix: Record<string, boolean>;
    constructor();
    get(bi: Body, bj: Body): boolean;
    set(bi: Body, bj: Body, value: boolean): void;
    reset(): void;
    setNumObjects(n: number): void;
}
