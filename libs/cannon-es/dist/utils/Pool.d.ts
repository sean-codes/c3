export declare class Pool {
    objects: any[];
    type: any;
    constructor();
    release(...args: any[]): Pool;
    get(): any;
    constructObject(): void;
    resize(size: number): Pool;
}
