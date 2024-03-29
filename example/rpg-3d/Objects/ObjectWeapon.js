import { c3 } from '../c3.js'

export class ObjectWeapon extends c3.Object {
   mesh() {
      const geo = new c3.THREE.BoxGeometry(0.5, 5, 1)
      const mat = c3.models.materialFind('WIREFRAME')
      const mesh = new c3.THREE.Mesh(geo, mat)
      
      return mesh
   }
   
   physics() {
      return {
         meshes: [{ mesh: this.mesh }],
         material: 'BOX',
         fixedRotation: true,
         mass: 0,
         collisionResponse: false,
         linkToMesh: true,
         watchCollisions: true
      }
   }
   
   create({ pos, parent }) {
      this.setPositionVec(new c3.Vector(0, 2.25, 0))
      this.parent = parent
   }
   
   step() {
      for (const collision of this.getCollisions()) {         
         if (collision.type === c3.types.Dragon && this.parent.isAttacking) {
            collision.killDragon()
         }
      }
   }
}
