import * as THREE from '../libs/three/build/three.module.js'


export class C3_Light {
   Directional({
      color = '#FFF',
      intensity = 1
   } = {}) {
      return new THREE.DirectionalLight(color, intensity)
   }
   
   Ambient({
      color = '#FFF',
      intensity = 0.5
   } = {}) {
      return new THREE.AmbientLight(color, intensity)
   }
}
