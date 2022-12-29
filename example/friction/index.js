import { c3 } from './c3.js'
import { ObjectPlayer } from './objects/ObjectPlayer.js'
import { ObjectLight } from './objects/ObjectLight.js'
import { ObjectGround } from './objects/ObjectGround.js'
import { ObjectPlatform } from './objects/ObjectPlatform.js'

export const KEYMAP = {
   left: 'a',
   right: 'd', 
   up: 'w', 
   down: 's', 
}

c3.init({
   types: {
      player: ObjectPlayer,
      light: ObjectLight,
      ground: ObjectGround,
      platform: ObjectPlatform,
   },

   keyMap: KEYMAP,
   
   init: function() {
      // c3.keyboard.toggleDebug()

      c3.mesh.setMaterialType(c3.const.MaterialTypePhong)
      c3.camera.setPosition(0, 10, 10)
      c3.camera.lookAt(0, -2, 0)

      
      c3.objects.create(c3.types.light)
      c3.objects.create(c3.types.ground)
      c3.objects.create(c3.types.player, {
         pos: new c3.Vector(0, 4, 0)
      })
      c3.objects.create(c3.types.platform, {
         pos: new c3.Vector(4, 0.75, 0)

      })

   },
   
   step: () => {
      
   }
})
