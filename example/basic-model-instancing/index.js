import { c3 } from './c3.js'
import { ObjectModel } from './objects/ObjectModel.js'
import { ObjectLight } from './objects/ObjectLight.js'
import { ObjectCamera } from './objects/ObjectCamera.js'

export const KEYMAP = {
   forward: 87,
   left: 65,
   right: 68,
   backward: 83,
   flyUp: 82,
   flyDown: 70,
}

c3.init({
   keyMap: KEYMAP,
   types: {
      model: ObjectModel,
      light: ObjectLight,
      camera: ObjectCamera,
   },
   
   models: [
      { name: 'rock', file: './Assets/rock.fbx', scale: 0.035, },
   ],
   
   init: function() {
      this.mesh.setMaterialType(this.const.MaterialTypePhong)
      // this.camera.setPosition(0, 0, 100)
      this.objects.create(c3.types.light)
      this.objects.create(c3.types.camera, { pos: new c3.Vector(100, 100, 100)})
      
      const count = 15
      const space = 10
      const offsetX = -(count * space)/2
      for (let z = 0; z < count; z++) {
         const zPos = (offsetX) + z * space
         for (let y = 0; y < count; y++) {
            const yPos = (offsetX) + y * space
            for (let x = 0; x < count; x++) {
               const xPos = (offsetX) + x * space
               this.objects.create(c3.types.model, { pos: new c3.Vector(xPos, yPos, zPos) })
            }
         }
      }
      
      console.log(c3.scene.object.children.length)
   },
   
   step: () => {
      
   }
})
