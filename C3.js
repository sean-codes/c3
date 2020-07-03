import * as THREE from './node_modules/three/build/three.module.js'
import { C3_Object } from './src/C3_Object.js'
import { C3_Objects } from './src/C3_Objects.js'
import { C3_Camera } from './src/C3_Camera.js'
import { C3_Physics } from './src/C3_Physics.js'
import { C3_Render } from './src/C3_Render.js'
import { C3_Scene } from './src/C3_Scene.js'
import { C3_Vector } from './src/C3_Vector.js'
import { C3_Light } from './src/C3_Light.js'
import { C3_Mesh } from './src/C3_Mesh.js'
import * as C3_Math from './src/C3_Math.js'
import { C3_Engine } from './src/C3_Engine.js'


export const Engine = C3_Engine
export const Object = C3_Object
export const Light = C3_Light
export const Mesh = C3_Mesh
export * from './src/constants.js'
export { THREE }
