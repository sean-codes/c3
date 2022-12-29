import { c3 } from '../c3.js'

export class ObjectGround extends c3.Object {
   mesh() {
      return this.c3.mesh.Box({ 
         size: [10, 1, 10],
         color: '#3a6' 
      })
   }

   physics() {
      return {
         meshes: [{ mesh: this.mesh, type: 'BOX' }],
         mass: 0,
         debug: true,
         friction: 0.01,
      }
   }
   
   step() {
   }
}
