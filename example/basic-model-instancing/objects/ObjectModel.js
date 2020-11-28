import { c3 } from '../c3.js'

export class ObjectModel extends c3.Object {
   mesh() {
      const model = c3.models.find('rock')

      // const clone = model.clone()
      // return clone
      const instance = model.instance()
      return instance
   }
   
   create({ pos }) {
      // this.setScale(5, 5, 5)
      this.setPositionVec(pos)
      this.spinSpeed = Math.random() * 0.01
      this.scaleSpeed = Math.random() * 0.01
      this.moveSpeed = Math.random() * 0.05
   }
   
   step() {
      this.rotateX(this.spinSpeed)
      this.rotateZ(this.spinSpeed)
      
      const currScale = this.getScale()
      this.setScale(
         currScale.x + this.scaleSpeed,
         currScale.y + this.scaleSpeed,
         currScale.z + this.scaleSpeed,
      )
      
      if (currScale.x > 1.5 || currScale.x < 1) this.scaleSpeed  *= -1
      
      const currPos = this.getPosition()
      
      if (currPos.y > 5 || currPos.y < -5) this.moveSpeed *= -1
      this.setPosition(
         currPos.x,
         currPos.y + this.moveSpeed,
         currPos.z,
      )
   }
}
