import { c3 } from '../c3.js'

export class ObjectExampleInstance extends c3.Object {
   mesh() {
      // const model = c3.models.find('rock')
      const model = c3.models.find('rock')

      // const clone = model.clone()
      // return clone
      const instance = model.instance(this)
      return instance
   }
   
   physics() {
      return {
         meshes: [{ mesh: this.mesh, shape: 'SPHERE' }],
         debug: true,
         mass: 0,
      }
   }
   
   create({ pos, scale=1 }) {
      // const scale = Math.ceil(Math.random() * 3)
      // this.setScale(scale, scale, scale)
      
      // this.rotateX(1)
      // this.setPositionVec(pos)
      // this.spinSpeed = Math.random() * 0.01
      this.spinSpeed = 0.01
      this.scaleSpeed = 0.01//Math.random() * 0.01
      this.moveSpeed = Math.random() * 0.05
   }
   
   step() {
      // this.rotateX(this.spinSpeed)
      // this.rotateZ(this.spinSpeed)
      // // 
      // const currScale = this.getScale()
      // this.setScale(
      //    currScale.x + this.scaleSpeed,
      //    currScale.y + this.scaleSpeed,
      //    currScale.z + this.scaleSpeed,
      // )
      // // 
      // if (currScale.x > 1.5 || currScale.x < 0.5) this.scaleSpeed  *= -1
      
      // 
      // const currPos = this.getPosition()
      // 
      // if (currPos.y > 5 || currPos.y < -5) this.moveSpeed *= -1
      // this.setPosition(
      //    currPos.x,
      //    currPos.y + this.moveSpeed,
      //    currPos.z,
      // )
   }
}
