import { Pool } from '../utils/Pool';
import { Vec3 } from '../math/Vec3';
export declare class Vec3Pool extends Pool {
    type: typeof Vec3;
    constructor();
    constructObject(): Vec3;
}
