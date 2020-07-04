import { C3 } from '../../src/C3.js'
const c3 = new C3()

class ObjectCube extends c3.Object {
   object() {
      return c3.mesh.Box({ size: [1, 1, 1], color: '#FFF' })
   }
   
   step() {
      this.rotateX(0.01)
      this.rotateZ(0.01)
   }
}

class ObjectLight extends c3.Object {
   object() {
      return c3.light.Directional()
   }
   
   create() {
      this.setPosition(0, 5, 5)
   }
}

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
   }
})
