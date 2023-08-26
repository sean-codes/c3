import type { Equation } from '../equations/Equation';
import type { World } from '../world/World';
export declare class Solver {
    equations: Equation[];
    constructor();
    solve(dt: number, world: World): number;
    addEquation(eq: Equation): void;
    removeEquation(eq: Equation): void;
    removeAllEquations(): void;
}
