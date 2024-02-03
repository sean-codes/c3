import { c3 } from '../c3.js'

export class ObjectCar extends c3.Object {
   mesh() {
      this.container = new c3.THREE.Object3D()
      this.box = c3.mesh.Box({ size: [1, 0.5, 1.5], color: '#844' })
      
      this.debugHtml = document.createElement('div')
      const html = c3.html.create(this.debugHtml)

      this.container.add(this.box)
      this.container.add(html)
      return this.container
   }

   physics() {
      return {
         meshes: [ 
            { mesh: this.box } 
         ],
         friction: 0.1,
      }
   }
   
   create() {
      this.currentSpeed = new c3.Vector(0, 0)
      this.direction = 0
      this.accel = 0

      // this.wheelFL = c3.objects.create(c3.types.wheel, { side: 1, position: new c3.Vector(1, 0, 0)})
      // this.wheelFR = c3.objects.create(c3.types.wheel, { side: -1, position: new c3.Vector(-1, 0, 0)})
   }

   step() {
      this.updateWheel()
      this.updateDebug()

      if (c3.keyboard.check(c3.keyMap.forward).held) {
         this.accel = Math.min(this.accel + 0.05, 3)
      } else {
         this.accel = Math.max(0, this.accel - 0.05)
      }

      if (c3.keyboard.check(c3.keyMap.left).held) {
         this.direction = c3.math.loopAngle(this.direction + 0.05)
      }

      if (c3.keyboard.check(c3.keyMap.right).held) {
         this.direction = c3.math.loopAngle(this.direction - 0.05)
      }

      this.setRotationY(this.direction)

      var currentSpeedX = Math.sin(this.direction) * -this.accel
      var currentSpeedY = Math.cos(this.direction) * -this.accel

      this.body.velocity.set(
         currentSpeedX*2,
         this.body.velocity.y,
         currentSpeedY*2,
      )
   }

   updateWheel() {
      // this.wheelFL.setRotationY(this.direction)
      // this.wheelFR.setRotationY(this.direction)
      // // this.wheelFL.setPosition(
      // //    this.position.x + 1,
      // //    this.position.y + 1,
      // //    this.position.z + 1
      // // )
      // var wflpos = this.wheelFL.getPosition()
      // var wfrpos = this.wheelFR.getPosition()
      // var angle = wflpos.sub(wfrpos)

      

      // this.wheelFR.body.velocity.set(
      //    currentSpeedX,
      //    this.body.velocity.y,
      //    currentSpeedY,
      // )
   }

   updateDebug() {
      this.debugHtml.innerHTML = `
         <style>
            .info {
               font-family: monospace;
               color: #FFF;
            }
         </style>
         <div class="info">accel: ${c3.math.round(this.accel, 100)}</div>
         <div class="info">direciton: ${c3.math.round(c3.math.degree(this.direction), 100)}</div>
      `
   }
}
