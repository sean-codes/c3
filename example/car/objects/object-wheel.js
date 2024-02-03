import { c3 } from '../c3.js'

export class ObjectWheel extends c3.Object {
   mesh({ side = 1}) {
      this.container = new c3.THREE.Object3D()


      // wheels
      this.sphere = c3.mesh.Sphere({ size: 0.2, color: '#FFF' })
      this.cylinder = c3.mesh.Cylinder({ size: [0.25, 0.25, 0.1, 16], color: '#444'})
      this.cylinder.rotateZ(Math.PI/2)
      
      this.cylinder.position.x = 0.1 * side

      this.container.add(this.sphere)
      this.container.add(this.cylinder)
      
      return this.container
   }

   physics() {
      return {
         meshes: [ 
            { mesh: this.sphere },
         ],
         // mass: 0,
      }
   }
   
   create({ position, side = 1}) {
      console.log('create')
      this.setPositionVec(position)
      
   }

   step() {

   }
}
