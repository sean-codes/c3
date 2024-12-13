import { c3 } from '../c3.js'

var CAR_LENGTH = 1.5
var CAR_WIDTH = 1

export class ObjectCar extends c3.Object {
   mesh() {
      this.container = new c3.THREE.Object3D()
      this.box = c3.mesh.Box({ size: [1, 0.25, CAR_LENGTH], color: '#844' })
      this.box.position.z = CAR_LENGTH/2

      this.debugHtml = document.createElement('div')
      // this.debugPos = c3.mesh.Box({ size: [0.25, 1, 0.25], color: 'red' })
      this.debugPosFR = c3.mesh.Box({ size: [0.25, 1, 0.25], color: 'pink' })
      this.debugPosFL = c3.mesh.Box({ size: [0.25, 1, 0.25], color: 'aqua' })
      this.debugPosRR = c3.mesh.Box({ size: [0.25, 1, 0.25], color: 'red' })
      this.debugPosRL = c3.mesh.Box({ size: [0.25, 1, 0.25], color: 'blue' })
      // c3.scene.object.add(this.debugPosFR)
      // c3.scene.object.add(this.debugPosFL)
      // c3.scene.object.add(this.debugPosRR)
      // c3.scene.object.add(this.debugPosRL)
      const html = c3.html.create(this.debugHtml)

      this.container.add(this.box)
      this.container.add(html)
      return this.container
   }

   // physics() {
      // return {
      //    meshes: [ 
      //       { mesh: this.box } 
      //    ],
      //    friction: 0.1,
      //    fixedRotation: true
      // }
   // }
   
   create() {
      this.currentSpeed = new c3.Vector(0, 0)
      this.direction = 0
      this.accel = 0
      this.turn = 0
      this.maxSpeed = 0.1

      this.wheelFL = c3.objects.create(c3.types.wheel, { side: 1, position: new c3.Vector(0.5, 0, -CAR_LENGTH)})
      this.wheelFR = c3.objects.create(c3.types.wheel, { side: -1, position: new c3.Vector(-0.5, 0, -CAR_LENGTH)})
      this.wheelRL = c3.objects.create(c3.types.wheel, { side: 1, position: new c3.Vector(0.5, 0, 0)})
      this.wheelRR = c3.objects.create(c3.types.wheel, { side: -1, position: new c3.Vector(-0.5, 0, 0)})
   }

   step() {
      // retur
      // this.updateWheel()
      this.updateDebug()

      if (c3.keyboard.check(c3.keyMap.forward).held) {
         this.accel = Math.min(this.accel + 0.05, this.maxSpeed)
      } else if (c3.keyboard.check(c3.keyMap.backward).held) {
         this.accel = Math.max(this.accel - 0.05, -this.maxSpeed)

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


      // this.body.velocity.set(
      //    currentSpeedX*2,
      //    this.body.velocity.y,
      //    currentSpeedY*2,
      // )
      // move container to wheels
      // rear
      var wrlpos = this.wheelRL.getPosition()
      var wrrpos = this.wheelRR.getPosition()
      var rAxelLen = wrlpos.distanceTo(wrrpos)
      var rAxelDir = wrrpos.clone().sub(wrlpos).normalize()
      var rAxelCenter = wrlpos.clone().add(rAxelDir.clone().multiplyScalar(rAxelLen/2))
      // console.log(rAxelCenter)
      // front
      this.debugPosFR.position.copy(rAxelCenter)
      var wfrpos = this.wheelFR.getPosition()
      var wflpos = this.wheelFL.getPosition()
      var fAxelLen = wflpos.distanceTo(wfrpos)
      var fAxelDir = wfrpos.clone().sub(wflpos).normalize()
      var fAxelCenter = wflpos.clone().add(fAxelDir.clone().multiplyScalar(fAxelLen/2))

      this.setPositionVec(rAxelCenter)
      // this.turnTowards(fAxelCenter, 1)
      var forwardDir = rAxelCenter.clone().sub(rAxelCenter).normalize()
      var dropForward = forwardDir.rotation
      var dropSide = rAxelDir.rotation
      // console.log(dropForward)
      // console.log()
      this.origin.lookAt(wrrpos)
      this.origin.lookAt(fAxelCenter)

      // this.rotateUpdate()
      // console.log(rAxelDir)
      // console.log(wrrpos.angleTo(wrlpos))
      // this.origin.rotateOnAxis(forwardDir, -wrrpos.angleTo(wrlpos))
      // this.origin.rotateOnAxis(forwardDir, rAxelCenter.angleTo(fAxelCenter))
      this.direction = this.getRotation().y


      // // move the box now
      // if (Math.abs(this.accel) > 0) {
      //    this.direction += this.turn * 0.5 * this.accel
      // }


      // var currentSpeedX = Math.sin(this.direction) * this.accel
      // var currentSpeedY = Math.cos(this.direction) * this.accel
      // this.move(
      //    currentSpeedX,
      //    0,
      //    currentSpeedY,
      // )

      // this.setRotationY(this.direction)
      // this.updateWheel()

   }

   updateWheel() {

      // this.wheelRL.move(this.accel)
      // this.wheelRL.turnWheel(this.turn)
      // this.wheelRR.move(this.accel)
      var pos = this.getPosition()
      var dir = this.getDirection()
      var faxel = dir.clone().multiplyScalar(CAR_LENGTH).add(pos)

      var left = dir.clone().applyAxisAngle(new c3.Vector(0, 1, 0), c3.math.radian(90)).multiplyScalar(CAR_WIDTH/2)
      var right = dir.applyAxisAngle(new c3.Vector(0, 1, 0), c3.math.radian(-90)).multiplyScalar(CAR_WIDTH/2)

      var wFRPos = faxel.clone().sub(left)
      var wFLPos = faxel.clone().add(left)
      var wRLPos = pos.clone().add(left)
      var wRRPos = pos.clone().add(right)
      // console.log(left)
      this.debugPosFR.position.copy(wFRPos)
      this.debugPosFL.position.copy(wFLPos)
      this.debugPosRL.position.copy(wRLPos)
      this.debugPosRR.position.copy(wRRPos)
      this.wheelFL.setPositionVec(wFLPos)
      this.wheelFR.setPositionVec(wFRPos)
      this.wheelRL.setPositionVec(wRLPos)
      this.wheelRR.setPositionVec(wRRPos)



      
      this.wheelFL.setRotationY(this.turn + this.direction)
      this.wheelFR.setRotationY(this.turn + this.direction)
      this.wheelRL.setRotationY(this.direction)
      this.wheelRR.setRotationY(this.direction)
      // var wflpos = this.wheelFL.getPosition()
      // var wfrpos = this.wheelFR.getPosition()
      // var angle = wflpos.sub(wfrpos)

      

      this.wheelFL.cylinder.rotateY(this.accel * -2)
      this.wheelFR.cylinder.rotateY(this.accel * -2)
      this.wheelRL.cylinder.rotateY(this.accel * -2)
      this.wheelRR.cylinder.rotateY(this.accel * -2)
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
