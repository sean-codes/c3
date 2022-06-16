import { c3 } from '../c3.js'

export class ObjectArrow extends c3.Object {
   mesh() {
      const geo = new c3.THREE.BoxGeometry(1, 1, 5)
      const mat = c3.models.materialFind('WIREFRAME')
      const mesh = new c3.THREE.Mesh(geo, mat)
      
      const modelArrow = c3.models.find('arrow').clone()
      modelArrow.object.rotation.x += Math.PI/2
      modelArrow.object.position.z -= 2
      mesh.add(modelArrow.object)
      
      return mesh
   }
   
   physics() {
      return {
         meshes: [{ mesh: this.mesh }],
         fixedRotation: true,
         mass: 1,
         collisionResponse: false,
         linkToMesh: true,
         watchCollisions: true
      }
   }
   
   create({ pos, rotation }) {
      this.setPositionVec(pos)
      this.setRotationVec(rotation)
      
      this.lifeSpan = 60 * 1  // 5 seconds
   }
   
   step() {
      const direction = this.getDirection()//.multiplyScalar(0.1)
      this.moveVec(direction)
      
      // destroy after a bit
      this.lifeSpan -= 1
      if (!this.lifeSpan) {
         this.destroy()
      }
      
      
      for (const collision of this.getCollisions()) {
         if (collision.type === c3.types.Dragon) {
            collision.killDragon()
            this.destroy()
         }
      }
   }
}
