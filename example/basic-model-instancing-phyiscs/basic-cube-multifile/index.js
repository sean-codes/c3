import { c3 } from './c3.js'
import { ObjectCube } from './objects/ObjectCube.js'
import { ObjectLight } from './objects/ObjectLight.js'

c3.init({
   types: {
      cube: ObjectCube,
      light: ObjectLight,
   },
   
   init: function() {
      this.mesh.setMaterialType(this.const.MaterialTypePhong)
      this.camera.setPosition(0, 0, 2.5)
      this.objects.create(c3.types.cube)
      this.objects.create(c3.types.light)
   },
   
   step: () => {
      
   }
})
