import { C3_Object } from '../c3.js'

export class ObjectCube extends C3_Object {
   object() {
      return this.c3.mesh.Box({ size: [1, 1, 1], color: '#FFF' })
   }
   
   step() {
      this.rotateX(0.01)
      this.rotateZ(0.01)
   }
}
