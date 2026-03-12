import { C3 } from '../../src/C3.js'
const c3 = new C3()

class ObjectCube extends c3.Object {
   mesh() {
      return c3.mesh.Box({ size: [1, 1, 1], color: '#FFF' })
   }
   
   step() {
      this.rotateX(0.01)
      this.rotateZ(0.01)
   }
}

class ObjectLight extends c3.Object {
   mesh() {
      return c3.light.Directional()
   }
   
   create() {
      this.setPosition(0, 5, 5)
   }
}

var eleAnologX = document.querySelector('#anologx')
var eleAnologY = document.querySelector('#anology')
var eleTableButtons = document.querySelector('#table-buttons')

c3.init({
   types: {
      Cube: ObjectCube,
      Light: ObjectLight,
   },
   
   init: function() {
      c3.mesh.setMaterialType(c3.const.MaterialTypePhong)
      c3.scene.setBackground('#555')
      c3.camera.setPosition(0, 0, 2)
      
      c3.objects.create(c3.types.Cube)
      c3.objects.create(c3.types.Light)
   },

   step: function() {
      var gamepad = c3.gamepad.read()

      if (gamepad) {
         // console.log(gamepad)
         // left anolog
         eleAnologX.querySelector('.x').innerHTML = gamepad?.anolog_left.x
         eleAnologX.querySelector('.y').innerHTML = gamepad?.anolog_left.y
         eleAnologX.querySelector('.rawX').innerHTML = gamepad?.anolog_left.rawX
         eleAnologX.querySelector('.rawY').innerHTML = gamepad?.anolog_left.rawY
         // right anolog
         eleAnologY.querySelector('.x').innerHTML = gamepad?.anolog_right.x
         eleAnologY.querySelector('.y').innerHTML = gamepad?.anolog_right.y
         eleAnologY.querySelector('.rawX').innerHTML = gamepad?.anolog_right.rawX
         eleAnologY.querySelector('.rawY').innerHTML = gamepad?.anolog_right.rawY

         // buttons
         eleTableButtons.querySelector('#x .value').innerHTML = !!gamepad.x.status.held
         eleTableButtons.querySelector('#circle .value').innerHTML = !!gamepad.circle.status.held
         eleTableButtons.querySelector('#triangle .value').innerHTML = !!gamepad.triangle.status.held
         eleTableButtons.querySelector('#square .value').innerHTML = !!gamepad.square.status.held
         eleTableButtons.querySelector('#start .value').innerHTML = !!gamepad.start.status.held
         eleTableButtons.querySelector('#options .value').innerHTML = !!gamepad.options.status.held

         // arrows
         eleTableButtons.querySelector('#down .value').innerHTML = !!gamepad.dpad_down?.status.held
         eleTableButtons.querySelector('#left .value').innerHTML = !!gamepad.dpad_left?.status.held
         eleTableButtons.querySelector('#up .value').innerHTML = !!gamepad.dpad_up?.status.held
         eleTableButtons.querySelector('#right .value').innerHTML = !!gamepad.dpad_right?.status.held

         // bumpers
         eleTableButtons.querySelector('#r1 .value').innerHTML = !!gamepad.r1?.status.held
         eleTableButtons.querySelector('#l1 .value').innerHTML = !!gamepad.l1?.status.held
         eleTableButtons.querySelector('#r2 .value').innerHTML = !!gamepad.r2?.status.held
         eleTableButtons.querySelector('#l2 .value').innerHTML = !!gamepad.l2?.status.held

         // analog click
         eleTableButtons.querySelector('#anolog_right_click .value').innerHTML = !!gamepad.anolog_right_click?.status.held
         eleTableButtons.querySelector('#anolog_left_click .value').innerHTML = !!gamepad.anolog_left_click?.status.held

         // updated pressed
         var pressedChecks = ['x', 'circle', 'triangle', 'square']
         for (var pressedCheck of pressedChecks) {
            if (gamepad[pressedCheck]?.status.down) {
               var ele = eleTableButtons.querySelector(`#${pressedCheck} .pressed`)
               ele.innerHTML = Number(ele.innerHTML) + 1
            }
         }
      }

   }
})
