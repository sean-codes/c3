import { c3, KEYMAP } from '../c3.js'


export class ObjectPlayer extends c3.Object {
   mesh() {
      const geoCircle = new c3.THREE.SphereGeometry(0.75, 8, 4)
      const matCircle = new c3.THREE.MeshBasicMaterial({ color: '#FaF', flatShading: true })
      const mesCircle = new c3.THREE.Mesh(geoCircle, matCircle)

      return mesCircle
      // return this.c3.mesh.Box({ 
      //    size: [1, 1, 1],
      //    color: '#FaF' 
      // })
   }
   
   physics() {
      return {
         meshes: [{ mesh: this.mesh, type: 'SPHERE' }],
         mass: 1,
         fixedRotation: true,
         debug: true,
         friction: 0.1,
      }
   }

   create({ pos }) {
      this.setPositionVec(pos)
      this.speed = 4
      // this.manualSpeed = new c3.Vector(0, 0)
   }

   step() {
      if (c3.keyboard.check(KEYMAP.left).held) {
         this.rotateY(0.05)
      }

      if (c3.keyboard.check(KEYMAP.right).held) {
         this.rotateY(-0.05)
      }

      if (c3.keyboard.check(KEYMAP.up).held) {
         const direction = this.getDirection()

         this.setVelocity(
            direction.x*this.speed,
            0,
            direction.z*this.speed
         )
      }
   }
}
