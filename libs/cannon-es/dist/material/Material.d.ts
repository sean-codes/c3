export declare type MaterialOptions = {
    friction?: number;
    restitution?: number;
};
export declare class Material {
    name: string;
    id: number;
    friction: number;
    restitution: number;
    static idCounter: number;
    constructor(options?: MaterialOptions | string);
}
