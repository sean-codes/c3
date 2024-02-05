import { c3 } from './c3.js'
import { ObjectCar } from './objects/object-car.js'
import { ObjectLight } from './objects/object-light.js'
import { ObjectGround } from './objects/object-ground.js'
import { ObjectWheel } from './objects/object-wheel.js'
import { ObjectRamp } from './objects/object-ramp.js'

c3.init({
   types: {
      car: ObjectCar,
      light: ObjectLight,
      ground: ObjectGround,
      wheel: ObjectWheel,
      ramp: ObjectRamp,
   },

    keyMap: {
      forward: 'w',
      left: 'a',
      right: 'd',
      backward: 's',
   },
   
   init: function() {
      window.c3 = c3
      c3.camera.setPosition(10, 5, 5)
      c3.camera.lookAt(0, 0, 0)
      this.objects.create(c3.types.light)
      this.objects.create(c3.types.ground, { position: new c3.Vector(0, -3, 0)})
      this.objects.create(c3.types.car, { position: new c3.Vector(0, 0, 0)})
      // this.objects.create(c3.types.ramp, { position: new c3.Vector(0, -2.5, 0) })
      // c3.physics.debug = true
   },
   
   step: () => {
      
   }
})
