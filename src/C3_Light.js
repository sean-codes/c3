import * as THREE from '../node_modules/three/build/three.module.js'


export class C3_Light {
   Directional({
      color = '#FFF'
   } = {}) {
      return new THREE.DirectionalLight(color)
   }
}
