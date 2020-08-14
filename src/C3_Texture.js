import * as THREE from '../node_modules/three/build/three.module.js'

export class C3_Texture {
   constructor({ c3, texture, loadInfo }) {
      this.c3 = c3
      this.texture = texture
      this.loadInfo = loadInfo
      this.name = loadInfo.name
      
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(loadInfo.repeatX || 1, loadInfo.repeatY || 1);
      if (loadInfo.pixelate) {
         texture.magFilter = THREE.NearestFilter
      }
   }
}
