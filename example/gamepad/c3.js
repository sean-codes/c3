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
         eleAnologX.querySelector('.x').innerHTML = gamepad.anolog_left.x
         eleAnologX.querySelector('.y').innerHTML = gamepad.anolog_left.y
         eleAnologX.querySelector('.rawX').innerHTML = gamepad.anolog_left.rawX
         eleAnologX.querySelector('.rawY').innerHTML = gamepad.anolog_left.rawY
         // right anolog
         eleAnologY.querySelector('.x').innerHTML = gamepad.anolog_right.x
         eleAnologY.querySelector('.y').innerHTML = gamepad.anolog_right.y
         eleAnologY.querySelector('.rawX').innerHTML = gamepad.anolog_right.rawX
         eleAnologY.querySelector('.rawY').innerHTML = gamepad.anolog_right.rawY
      }
   }
})
