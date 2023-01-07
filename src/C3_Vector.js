import * as THREE from '../libs/three/build/three.module.mjs'

export class C3_Vector {
   // can't remember why you did this. will remove later
   constructor(x=0, y=0, z=null) {
      if (z !== null) {
         return new THREE.Vector3(x, y, z)
      }

      return new THREE.Vector2(x, y)
   }
}
