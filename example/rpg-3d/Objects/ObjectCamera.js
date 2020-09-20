import { c3 } from '../c3.js'

export class ObjectCamera extends c3.Object {
   mesh() {
      const { camera } = c3
      camera.setPosition(0, 0, -15)
      camera.lookAt(0, 0, 0)
      
      
      this.xRot = new c3.three.Object3D()
      this.yRot = new c3.three.Object3D()
      this.xRot.rotation.x += 0.6
      this.xRot.position.y += 4
      this.yRot.add(this.xRot)
      this.xRot.add(camera.object)
      return this.yRot
   }
   
   create({ player }) {
      this.player = player
      
      window.addEventListener('mousewheel', (e) => {
         this.xRot.rotation.x -= e.deltaY/100
         this.xRot.rotation.x = Math.min(this.xRot.rotation.x, Math.PI/2)
         this.xRot.rotation.x = Math.max(this.xRot.rotation.x, -0.25)
         this.yRot.rotation.y += e.deltaX/100
         this.yRot.rotation.y = c3.math.loopAngle(this.yRot.rotation.y)
      })
   }
   
   step() {
      const { mesh } = this
      this.setPositionVec(this.player.getPosition())
   }
   
   pointTowards(angle) {
      this.yRot.rotation.y += c3.math.angleToAngle(this.yRot.rotation.y, angle) / 10
      this.yRot.rotation.y = c3.math.loopAngle(this.yRot.rotation.y)
   }
}
