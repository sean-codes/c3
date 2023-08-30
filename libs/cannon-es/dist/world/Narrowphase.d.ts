import { Shape } from '../shapes/Shape';
import { Vec3 } from '../math/Vec3';
import { Quaternion } from '../math/Quaternion';
import { Body } from '../objects/Body';
import { Vec3Pool } from '../utils/Vec3Pool';
import { ContactEquation } from '../equations/ContactEquation';
import { FrictionEquation } from '../equations/FrictionEquation';
import type { Box } from '../shapes/Box';
import type { Sphere } from '../shapes/Sphere';
import type { ConvexPolyhedron } from '../shapes/ConvexPolyhedron';
import type { Particle } from '../shapes/Particle';
import type { Plane } from '../shapes/Plane';
import type { Trimesh } from '../shapes/Trimesh';
import type { Heightfield } from '../shapes/Heightfield';
import type { ContactMaterial } from '../material/ContactMaterial';
import type { World } from '../world/World';
export declare const COLLISION_TYPES: {
    sphereSphere: 1;
    spherePlane: 3;
    boxBox: 4;
    sphereBox: 5;
    planeBox: 6;
    convexConvex: 16;
    sphereConvex: 17;
    planeConvex: 18;
    boxConvex: 20;
    sphereHeightfield: 33;
    boxHeightfield: 36;
    convexHeightfield: 48;
    sphereParticle: 65;
    planeParticle: 66;
    boxParticle: 68;
    convexParticle: 80;
    sphereTrimesh: 257;
    planeTrimesh: 258;
};
export declare type CollisionType = typeof COLLISION_TYPES[keyof typeof COLLISION_TYPES];
export declare class Narrowphase {
    contactPointPool: ContactEquation[];
    frictionEquationPool: FrictionEquation[];
    result: ContactEquation[];
    frictionResult: FrictionEquation[];
    v3pool: Vec3Pool;
    world: World;
    currentContactMaterial: ContactMaterial;
    enableFrictionReduction: boolean;
    [COLLISION_TYPES.sphereSphere]: typeof Narrowphase.prototype.sphereSphere;
    [COLLISION_TYPES.spherePlane]: typeof Narrowphase.prototype.spherePlane;
    [COLLISION_TYPES.boxBox]: typeof Narrowphase.prototype.boxBox;
    [COLLISION_TYPES.sphereBox]: typeof Narrowphase.prototype.sphereBox;
    [COLLISION_TYPES.planeBox]: typeof Narrowphase.prototype.planeBox;
    [COLLISION_TYPES.convexConvex]: typeof Narrowphase.prototype.convexConvex;
    [COLLISION_TYPES.sphereConvex]: typeof Narrowphase.prototype.sphereConvex;
    [COLLISION_TYPES.planeConvex]: typeof Narrowphase.prototype.planeConvex;
    [COLLISION_TYPES.boxConvex]: typeof Narrowphase.prototype.boxConvex;
    [COLLISION_TYPES.sphereHeightfield]: typeof Narrowphase.prototype.sphereHeightfield;
    [COLLISION_TYPES.boxHeightfield]: typeof Narrowphase.prototype.boxHeightfield;
    [COLLISION_TYPES.convexHeightfield]: typeof Narrowphase.prototype.convexHeightfield;
    [COLLISION_TYPES.sphereParticle]: typeof Narrowphase.prototype.sphereParticle;
    [COLLISION_TYPES.planeParticle]: typeof Narrowphase.prototype.planeParticle;
    [COLLISION_TYPES.boxParticle]: typeof Narrowphase.prototype.boxParticle;
    [COLLISION_TYPES.convexParticle]: typeof Narrowphase.prototype.convexParticle;
    [COLLISION_TYPES.sphereTrimesh]: typeof Narrowphase.prototype.sphereTrimesh;
    [COLLISION_TYPES.planeTrimesh]: typeof Narrowphase.prototype.planeTrimesh;
    constructor(world: World);
    createContactEquation(bi: Body, bj: Body, si: Shape, sj: Shape, overrideShapeA?: Shape | null, overrideShapeB?: Shape | null): ContactEquation;
    createFrictionEquationsFromContact(contactEquation: ContactEquation, outArray: FrictionEquation[]): boolean;
    createFrictionFromAverage(numContacts: number): void;
    getContacts(p1: Body[], p2: Body[], world: World, result: ContactEquation[], oldcontacts: ContactEquation[], frictionResult: FrictionEquation[], frictionPool: FrictionEquation[]): void;
    sphereSphere(si: Sphere, sj: Sphere, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): boolean | void;
    spherePlane(si: Sphere, sj: Plane, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    boxBox(si: Box, sj: Box, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    sphereBox(si: Sphere, sj: Box, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    planeBox(si: Plane, sj: Box, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    convexConvex(si: ConvexPolyhedron, sj: ConvexPolyhedron, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean, faceListA?: number[] | null, faceListB?: number[] | null): true | void;
    sphereConvex(si: Sphere, sj: ConvexPolyhedron, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    planeConvex(planeShape: Plane, convexShape: ConvexPolyhedron, planePosition: Vec3, convexPosition: Vec3, planeQuat: Quaternion, convexQuat: Quaternion, planeBody: Body, convexBody: Body, si?: Shape, sj?: Shape, justTest?: boolean): true | void;
    boxConvex(si: Box, sj: ConvexPolyhedron, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    sphereHeightfield(sphereShape: Sphere, hfShape: Heightfield, spherePos: Vec3, hfPos: Vec3, sphereQuat: Quaternion, hfQuat: Quaternion, sphereBody: Body, hfBody: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    boxHeightfield(si: Box, sj: Heightfield, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    convexHeightfield(convexShape: ConvexPolyhedron, hfShape: Heightfield, convexPos: Vec3, hfPos: Vec3, convexQuat: Quaternion, hfQuat: Quaternion, convexBody: Body, hfBody: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    sphereParticle(sj: Sphere, si: Particle, xj: Vec3, xi: Vec3, qj: Quaternion, qi: Quaternion, bj: Body, bi: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    planeParticle(sj: Plane, si: Particle, xj: Vec3, xi: Vec3, qj: Quaternion, qi: Quaternion, bj: Body, bi: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    boxParticle(si: Box, sj: Particle, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    convexParticle(sj: ConvexPolyhedron, si: Particle, xj: Vec3, xi: Vec3, qj: Quaternion, qi: Quaternion, bj: Body, bi: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    sphereTrimesh(sphereShape: Sphere, trimeshShape: Trimesh, spherePos: Vec3, trimeshPos: Vec3, sphereQuat: Quaternion, trimeshQuat: Quaternion, sphereBody: Body, trimeshBody: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    planeTrimesh(planeShape: Plane, trimeshShape: Trimesh, planePos: Vec3, trimeshPos: Vec3, planeQuat: Quaternion, trimeshQuat: Quaternion, planeBody: Body, trimeshBody: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
}