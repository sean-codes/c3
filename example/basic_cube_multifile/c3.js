import * as C3 from '../../src/C3.js'
export { C3_Object } from '../../src/C3.js'
import { ObjectCube } from './objects/ObjectCube.js'
import { ObjectLight } from './objects/ObjectLight.js'

// This is awful :]
const c3 = new C3.Engine({
   types: {
      cube: ObjectCube,
      light: ObjectLight,
   },
   
   init: function() {
      this.mesh.setMaterialType(C3.MaterialTypePhong)
      this.camera.setPosition(0, 0, 2.5)
      this.objects.create(this.types.light)
      this.objects.create(this.types.cube)
   },
   
   step: () => {
      
   }
})
