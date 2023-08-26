import type { Body } from '../objects/Body';
import type { Equation } from '../equations/Equation';
export declare type ConstraintOptions = {
    collideConnected?: boolean;
    wakeUpBodies?: boolean;
};
export declare class Constraint {
    equations: Equation[];
    bodyA: Body;
    bodyB: Body;
    id: number;
    collideConnected: boolean;
    static idCounter: number;
    constructor(bodyA: Body, bodyB: Body, options?: ConstraintOptions);
    update(): void;
    enable(): void;
    disable(): void;
}
