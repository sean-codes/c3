import { c3 } from '../c3.js'

export class ObjectArrow extends c3.Object {
   mesh() {
      const geo = new c3.three.BoxGeometry(1, 1, 5)
      const mat = c3.models.materialFind('WIREFRAME')
      const mesh = new c3.three.Mesh(geo, mat)
      
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
         mass: 0,
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
      this.mesh.position.add(direction)
      
      // destroy after a bit
      this.lifeSpan -= 1
      if (!this.lifeSpan) {
         this.destroy()
      }
      
      
      for (const collision of this.getCollisions()) {
         const { other } = collision
         
         if (other.type === c3.types.Dragon) {
            other.killDragon()
            this.destroy()
         }
      }
   }
}
