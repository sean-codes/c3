import { c3 } from '../c3.js'

export class ObjectBox extends c3.Object {
   mesh() {
      const scale = c3.math.randomRange(0.5, 2)
      const geo = new c3.three.BoxGeometry(scale, scale, scale)
      const mat = new c3.three.MeshLambertMaterial({ color: '#F66' })
      const mes = new c3.three.Mesh(geo, mat)
      
      // c3.material.create("BOX", { type: "Lambert", color: "#F44" })
      // const mesh = c3.shape.create("BOX", { mat: "BOX", size: [1, 1, 1] })
      // put this in a config to default?
      mes.receiveShadow = true
      mes.castShadow = true
      return mes
   }
   
   physics() {
      return {
         meshes: [ this.mesh ],
         material: 'BOX',
         // debug: true,
      }
   }
   
   create() {
      this.xOff = 20
      this.zOff = 20
      this.spread = 1
      
      this.setPositionVec(new c3.Vector(
         this.xOff + c3.math.randomRange(-this.spread, this.spread), 
         c3.math.randomRange(10, 20), 
         this.zOff + c3.math.randomRange(-this.spread, this.spread)
      ))
      
      this.resetInterval = 60*6
      this.resetTime = c3.math.iRandom(this.resetInterval)
   }
   
   step() {
      if (!this.resetTime--) {
         this.resetTime = this.resetInterval
         this.setPositionVec(new c3.Vector(
            this.xOff + c3.math.randomRange(-this.spread, this.spread), 
            c3.math.randomRange(10, 20), 
            this.zOff + c3.math.randomRange(-this.spread, this.spread)
         ))
      }
   }
}
