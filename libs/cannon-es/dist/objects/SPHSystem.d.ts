import { Vec3 } from '../math/Vec3';
import type { Body } from '../objects/Body';
export declare class SPHSystem {
    particles: Body[];
    density: number;
    smoothingRadius: number;
    speedOfSound: number;
    viscosity: number;
    eps: number;
    pressures: number[];
    densities: number[];
    neighbors: Body[][];
    constructor();
    add(particle: Body): void;
    remove(particle: Body): void;
    getNeighbors(particle: Body, neighbors: Body[]): void;
    update(): void;
    w(r: number): number;
    gradw(rVec: Vec3, resultVec: Vec3): void;
    nablaw(r: number): number;
}
