import { Vec3 } from '../math/Vec3';
export declare class JacobianElement {
    spatial: Vec3;
    rotational: Vec3;
    constructor();
    multiplyElement(element: JacobianElement): number;
    multiplyVectors(spatial: Vec3, rotational: Vec3): number;
}
