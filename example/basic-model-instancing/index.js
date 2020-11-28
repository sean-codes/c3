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
      this.camera.setPosition(0, 0, 100)
      this.objects.create(c3.types.light)
      
      const count = 100
      const space = 4.5
      const offset = -(count * space)/2
      for (let y = 0; y < 100; y++) {
         for (let i = 0; i < count; i++) {
            const xPos = (offset) + i * space
            this.objects.create(c3.types.model, { pos: new c3.Vector(xPos, y, 0) })
         }
      }
      
      console.log(c3.scene.object.children.length)
   },
   
   step: () => {
      
   }
})
