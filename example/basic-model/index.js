import { c3 } from './c3.js'
import { ObjectModel } from './objects/ObjectModel.js'
import { ObjectLight } from './objects/ObjectLight.js'

c3.init({
   types: {
      model: ObjectModel,
      light: ObjectLight,
   },
   
   models: [
      { name: 'rock', file: './Assets/rock.fbx', scale: 0.035, },
   ],
   
   init: function() {
      this.mesh.setMaterialType(this.const.MaterialTypePhong)
      this.camera.setPosition(0, 0, 20)
      this.objects.create(c3.types.light)
      this.objects.create(c3.types.model, { pos: new c3.Vector(0, 0, 0) })
   },
   
   step: () => {
      
   }
})
