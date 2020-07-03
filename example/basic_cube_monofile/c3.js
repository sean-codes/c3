import * as C3 from '../../C3.js'

const c3 = new C3.Engine()

c3.mesh.setMaterialType(C3.MaterialTypePhong)
c3.scene.setBackground('#555')
c3.camera.setPosition(0, 0, 2)

class ObjectCube extends c3.Object {
   object() {
      return c3.mesh.Box({ size: [1, 1, 1], color: '#FFF' })
   }
   
   step() {
      this.rotateX(0.01)
      this.rotateZ(0.01)
   }
}

class ObjectLight extends C3.Object {
   object() {
      return c3.light.Directional()
   }
   
   create() {
      this.setPosition(0, 5, 5)
   }
}



c3.objects.create(ObjectCube)
c3.objects.create(ObjectLight)
