export declare class TupleDictionary {
    data: {
        [id: string]: any;
        keys: string[];
    };
    constructor();
    get(i: number, j: number): any;
    set(i: number, j: number, value: any): void;
    reset(): void;
}
