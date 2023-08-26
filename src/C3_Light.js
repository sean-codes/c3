import * as THREE from '../libs/three/build/three.module.js'


export class C3_Light {
   Directional({
      color = '#FFF'
   } = {}) {
      return new THREE.DirectionalLight(color)
   }
   
   Ambient({
      color = '#FFF',
      intensity = 0.5
   } = {}) {
      return new THREE.AmbientLight(color, intensity)
   }
}
