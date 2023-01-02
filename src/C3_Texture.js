import * as THREE from '../libs/three/build/three.module.mjs'

export class C3_Texture {
   constructor({ c3, texture, loadInfo }) {
      this.c3 = c3
      this.texture = texture
      this.texture.needsUpdate = true // required for clone
      this.loadInfo = loadInfo
      this.name = loadInfo.name
      
      if (loadInfo.repeatX || loadInfo.repeatY) {
         texture.wrapS = THREE.RepeatWrapping
         texture.wrapT = THREE.RepeatWrapping
         texture.repeat.set(loadInfo.repeatX || 1, loadInfo.repeatY || 1);
      }
      
      if (loadInfo.pixelate) {
         texture.magFilter = THREE.NearestFilter
         texture.minFilter = THREE.NearestFilter
      }
      
      texture.flipY = false // for glft textures
      // not sure. probably delete
      // texture.anisotropy = c3.render.renderer.capabilities.getMaxAnisotropy()
      // texture.offset = new THREE.Vector2(0.002, 0)
   }
   
   clone() {
      return new C3_Texture({ 
         c3: this.c3, 
         texture: this.texture.clone(), 
         loadInfo: this.loadInfo 
      })
   }
   
   setRepeat(x, y) {
      this.texture.repeat.x = x
      this.texture.repeat.y = y
   }
   
   destroy() {
      this.texture.dispose()
   }
}
