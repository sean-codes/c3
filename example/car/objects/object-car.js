import { c3 } from '../c3.js'

var CAR_LENGTH = 1.5
var CAR_WIDTH = 1

export class ObjectCar extends c3.Object {
   mesh() {
      this.container = new c3.THREE.Object3D()
      this.box = c3.mesh.Box({ size: [1, 0.25, CAR_LENGTH], color: '#844' })
      this.box.position.z = -1
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
         fixedRotation: true
      }
   }
   
   create() {
      this.currentSpeed = new c3.Vector(0, 0)
      this.direction = 0
      this.accel = 0
      this.turn = 0

      this.wheelFL = c3.objects.create(c3.types.wheel, { side: 1, position: new c3.Vector(0.5, 0, -CAR_LENGTH)})
      this.wheelFR = c3.objects.create(c3.types.wheel, { side: -1, position: new c3.Vector(-0.5, 0, -CAR_LENGTH)})
      this.wheelRL = c3.objects.create(c3.types.wheel, { side: 1, position: new c3.Vector(0.5, 0, 0)})
      this.wheelRR = c3.objects.create(c3.types.wheel, { side: -1, position: new c3.Vector(-0.5, 0, 0)})
   }

   step() {
      this.updateWheel()
      this.updateDebug()

      if (c3.keyboard.check(c3.keyMap.forward).held) {
         this.accel = Math.min(this.accel + 0.05, 3)
      } else if (c3.keyboard.check(c3.keyMap.backward).held) {
         this.accel = Math.max(this.accel - 0.05, -3)

      } else {
         var slow = Math.sign(this.accel) * -1 * 0.05
         this.accel = this.accel + slow

         if (Math.abs(this.accel) < 0.1) {
            this.accel = 0
         }
      }

      if (c3.keyboard.check(c3.keyMap.left).held) {
         this.turn = Math.min(c3.math.radian(50), this.turn + 0.05)
      }

      if (c3.keyboard.check(c3.keyMap.right).held) {
         this.turn = Math.max(c3.math.radian(-50), this.turn - 0.05)
      }

      if (Math.abs(this.accel) > 0) {
         this.direction += this.turn * 0.025 * this.accel
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
      
      var pos = this.getPosition()
      var dir = this.getDirection()
      var faxel = dir.clone().multiplyScalar(-CAR_LENGTH).add(pos)

      var left = dir.clone().applyAxisAngle(new c3.Vector(0, 1, 0), c3.math.radian(90)).multiplyScalar(CAR_WIDTH/2)
      // var right = dir.applyAxisAngle(new c3.Vector(0, 1, 0), c3.math.radian(-90)).multiplyScalar(CAR_WIDTH/2)

      var wFlPos = faxel.clone().add(left)
      var wFRPos = faxel.clone().sub(left)
      // console.log(left)

      this.wheelFL.setPositionVec(wFlPos)
      this.wheelFR.setPositionVec(wFRPos)
      this.wheelRL.setPositionVec(pos.clone().add(dir.clone().multiplyScalar(-0.5)).add(left))
      this.wheelRR.setPositionVec(pos.clone().add(dir.clone().multiplyScalar(-0.5)).sub(left))



      
      this.wheelFL.setRotationY(this.turn + this.direction)
      this.wheelFR.setRotationY(this.turn + this.direction)
      this.wheelRL.setRotationY(this.direction)
      this.wheelRR.setRotationY(this.direction)
      // var wflpos = this.wheelFL.getPosition()
      // var wfrpos = this.wheelFR.getPosition()
      // var angle = wflpos.sub(wfrpos)

      

      this.wheelFL.cylinder.rotateY(this.accel * 0.1)
      this.wheelFR.cylinder.rotateY(this.accel * 0.1)
      this.wheelRL.cylinder.rotateY(this.accel * 0.1)
      this.wheelRR.cylinder.rotateY(this.accel * 0.1)
      // this.wheelFR.body.velocity.set(
      //    currentSpeedX,
      //    this.body.velocity.y,
      //    currentSpeedY,
      // )
   }

   updateDebug() {
      return
      this.debugHtml.innerHTML = `
         <style>
            .info {
               font-family: monospace;
               color: #FFF;
            }
         </style>
         <div class="info">accel: ${c3.math.round(this.accel, 100)}</div>
         <div class="info">turn: ${c3.math.round(c3.math.degree(this.turn), 100)}</div>
      `
   }
}
