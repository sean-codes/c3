import { Solver } from '../solver/Solver';
import { Body } from '../objects/Body';
import type { Equation } from '../equations/Equation';
import type { World } from '../world/World';
declare type SplitSolverNode = {
    body: Body | null;
    children: SplitSolverNode[];
    eqs: Equation[];
    visited: boolean;
};
export declare class SplitSolver extends Solver {
    iterations: number;
    tolerance: number;
    subsolver: SplitSolver;
    nodes: SplitSolverNode[];
    nodePool: SplitSolverNode[];
    constructor(subsolver: SplitSolver);
    createNode(): SplitSolverNode;
    solve(dt: number, world: World): number;
}
export {};
