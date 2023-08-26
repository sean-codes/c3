export declare class OverlapKeeper {
    current: number[];
    previous: number[];
    constructor();
    getKey(i: number, j: number): number;
    set(i: number, j: number): void;
    tick(): void;
    getDiff(additions: number[], removals: number[]): void;
}
