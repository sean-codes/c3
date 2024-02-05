import { c3 } from '../c3.js'

export class ObjectGround extends c3.Object {
   mesh() {
      this.box = this.c3.mesh.Box({ size: [20, 1, 20], color: '#465' })
      return this.box
   }

   physics() {
      return {
         meshes: [ 
            { mesh: this.box,  } 
         ],
         mass: 0,
      }
   }

   create({ position }) {
      this.setPositionVec(position)
   }
   
   step() {
      
   }
}
