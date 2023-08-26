import { Solver } from '../solver/Solver';
import type { World } from '../world/World';
export declare class GSSolver extends Solver {
    iterations: number;
    tolerance: number;
    constructor();
    solve(dt: number, world: World): number;
}
