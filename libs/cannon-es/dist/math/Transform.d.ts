import { Vec3 } from '../math/Vec3';
import { Quaternion } from '../math/Quaternion';
export declare type TransformOptions = {
    position?: Vec3;
    quaternion?: Quaternion;
};
export declare class Transform {
    position: Vec3;
    quaternion: Quaternion;
    constructor(options?: TransformOptions);
    pointToLocal(worldPoint: Vec3, result?: Vec3): Vec3;
    pointToWorld(localPoint: Vec3, result?: Vec3): Vec3;
    vectorToWorldFrame(localVector: Vec3, result?: Vec3): Vec3;
    static pointToLocalFrame(position: Vec3, quaternion: Quaternion, worldPoint: Vec3, result?: Vec3): Vec3;
    static pointToWorldFrame(position: Vec3, quaternion: Quaternion, localPoint: Vec3, result?: Vec3): Vec3;
    static vectorToWorldFrame(quaternion: Quaternion, localVector: Vec3, result?: Vec3): Vec3;
    static vectorToLocalFrame(position: Vec3, quaternion: Quaternion, worldVector: Vec3, result?: Vec3): Vec3;
}
