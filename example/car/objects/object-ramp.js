import { c3 } from '../c3.js'

export class ObjectRamp extends c3.Object {
   mesh() {
      this.box = this.c3.mesh.Box({ size: [3, 0.25, 3], color: '#447' })
      return this.box
   }

   physics() {
      return {
         meshes: [ 
            { mesh: this.box,  } 
         ],
         mass: 0,

         friction: 0.95
      }
   }

   create({ position }) {
      this.setPositionVec(position)
      this.rotateX(Math.PI * 0.025)
   }
   
   step() {
      
   }
}
