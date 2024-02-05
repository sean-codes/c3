import { c3 } from '../c3.js'

export class ObjectWheel extends c3.Object {
   mesh({ side = 1}) {
      this.container = new c3.THREE.Object3D()



      // wheels
      this.sphere = c3.mesh.Sphere({ size: 0.1, color: '#FFF' })
      this.cylinder = c3.mesh.Cylinder({ size: [0.25, 0.25, 0.1, 6], color: '#444'})
      this.cylinder.rotateZ(Math.PI/2)
      
      this.cylinder.position.x = 0.1 * side

      this.sphere.add(this.cylinder)
      this.container.add(this.sphere)
      
      return this.container
   }

   // physics() {
   //    return {
   //       meshes: [ 
   //          { mesh: this.sphere },
   //       ],
   //       mass: 0,
   //    }
   // }
   
   create({ position, side = 1}) {
      this.setPositionVec(position)
   }

   step() {

   }
}
