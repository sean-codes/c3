import { c3 } from '../c3.js'

export class ObjectPlatform extends c3.Object {
   mesh() {
      return this.c3.mesh.Box({ 
         size: [5, 0.5, 5],
         color: '#d66' 
      })
   }

   physics() {
      return {
         meshes: [{ mesh: this.mesh, type: 'BOX' }],
         mass: 0,
         debug: true,
         friction: 0.1,
      }
   }
   
   create({ pos }) {
      this.setPositionVec(pos)
      this.rotateZ(0.25)
   }
}
