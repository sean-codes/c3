import { c3 } from './c3.js'
import { ObjectModel } from './objects/ObjectModel.js'
import { ObjectLight } from './objects/ObjectLight.js'
import { ObjectCamera } from './objects/ObjectCamera.js'
import { ObjectGrid } from './objects/ObjectGrid.js'

export const KEYMAP = {
   forward: 'w',
   left: 'a',
   right: 'd',
   backward: 's',
   flyUp: 'r',
   flyDown: 'f',
   del: 'backspace',
   add: 'enter',
}

c3.init({
   keyMap: KEYMAP,
   types: {
      model: ObjectModel,
      light: ObjectLight,
      camera: ObjectCamera,
      grid: ObjectGrid,
   },
   
   models: [
      { name: 'rock', file: './Assets/rock.glb', scale: 3, },
   ],
   
   init: function() {
      this.mesh.setMaterialType(this.const.MaterialTypePhong)
      this.objects.create(c3.types.light)
      this.objects.create(c3.types.grid)
      this.objects.create(c3.types.camera, { pos: new c3.Vector(30, 30, 30)})
      
      const startTime = Date.now()
      
      const count = 2
      const space = 10
      const offsetX = -(count * space)/2
      for (let z = 0; z < count; z++) {
         const zPos = (offsetX) + z * space
         for (let y = 0; y < count; y++) {
            const yPos = (offsetX) + y * space
            for (let x = 0; x < count; x++) {
               const xPos = (offsetX) + x * space
               // this.objects.create(c3.types.model, { pos: new c3.Vector(xPos, 0, 0) })
               c3.objects.create(c3.types.model, { pos: new c3.Vector(xPos, yPos, zPos) })
            }
         }
      }
      console.log('time to init', Date.now() - startTime)
      console.log('scene object count', c3.scene.object.children.length)
   },
   
   step: () => {
      
   }
})
