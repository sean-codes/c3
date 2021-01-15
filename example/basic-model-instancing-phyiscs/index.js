import { c3 } from './c3.js'
import { ObjectExampleInstanceTraverse } from './objects/ObjectExampleInstanceTraverse.js'
import { ObjectExampleInstance } from './objects/ObjectExampleInstance.js'
import { ObjectExampleClone } from './objects/ObjectExampleClone.js'
import { ObjectExampleCloneTraverse } from './objects/ObjectExampleCloneTraverse.js'
import { ObjectLight } from './objects/ObjectLight.js'
import { ObjectCamera } from './objects/ObjectCamera.js'

export const KEYMAP = {
   forward: 87,
   left: 65,
   right: 68,
   backward: 83,
   flyUp: 82,
   flyDown: 70,
   del: 8,
}

c3.init({
   keyMap: KEYMAP,
   types: {
      exampleInstanceTraverse: ObjectExampleInstanceTraverse,
      exampleInstance: ObjectExampleInstance,
      exampleClone: ObjectExampleClone,
      exampleCloneTraverse: ObjectExampleCloneTraverse,
      light: ObjectLight,
      camera: ObjectCamera,
   },
   
   models: [
      { name: 'rock', file: './Assets/rock.fbx', scale: 0.035, },
      { name: 'house', file: './Assets/wood_house_two_story.glb', scale: 0.5, },
      { name: 'boxrock', file: './Assets/box_rock_1.fbx', scale: 0.025, },
   ],
   
   init: function() {
      this.mesh.setMaterialType(this.const.MaterialTypePhong)
      this.objects.create(c3.types.light)
      this.objects.create(c3.types.camera, { pos: new c3.Vector(0, 0, 25)})
      // this.objects.create(c3.types.camera, { pos: new c3.Vector(0, 0, 50)})
      
      const startTime = Date.now()
      
      // this.objects.create(c3.types.exampleInstanceTraverse, { pos: new c3.Vector(0, 4, 0), scale: 1, })
      // this.objects.create(c3.types.exampleInstance, { pos: new c3.Vector(-10, 4, 0), scale: 1, })
      // this.objects.create(c3.types.exampleInstance, { pos: new c3.Vector(0, 0, 0), scale: 0.75, })
      // this.objects.create(c3.types.exampleCloneTraverse, { pos: new c3.Vector(0, -4, 0), scale: 1, })
      this.objects.create(c3.types.exampleClone, { pos: new c3.Vector(0, -8, 0), scale: 1, })
      // const count = 3s
      // const space = 10
      // const offsetX = -(count * space)/2
      // for (let z = 0; z < count; z++) {
      //    const zPos = (offsetX) + z * space
      //    for (let y = 0; y < count; y++) {
      //       const yPos = (offsetX) + y * space
      //       for (let x = 0; x < count; x++) {
      //          const xPos = (offsetX) + x * space
      //          // this.objects.create(c3.types.model, { pos: new c3.Vector(xPos, 0, 0) })
      //          this.objects.create(c3.types.model, { pos: new c3.Vector(xPos, yPos, zPos) })
      //       }
      //    }
      // }
      console.log('time to init', Date.now() - startTime)
      console.log('scene object count', c3.scene.object.children.length)
   },
   
   step: () => {
      
   }
})
