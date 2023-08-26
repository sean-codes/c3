import type { Material } from '../material/Material';
export declare type ContactMaterialOptions = {
    friction?: number;
    restitution?: number;
    contactEquationStiffness?: number;
    contactEquationRelaxation?: number;
    frictionEquationStiffness?: number;
    frictionEquationRelaxation?: number;
};
export declare class ContactMaterial {
    id: number;
    materials: [Material, Material];
    friction: number;
    restitution: number;
    contactEquationStiffness: number;
    contactEquationRelaxation: number;
    frictionEquationStiffness: number;
    frictionEquationRelaxation: number;
    static idCounter: number;
    constructor(m1: Material, m2: Material, options: ContactMaterialOptions);
}
