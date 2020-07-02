import * as THREE from '../node_modules/three/build/three.module.js'

export class C3_Scene {
   constructor() {
      this.object = new THREE.Scene()
   }
   
   setFog(start, end) {
      this.object.fog = new THREE.Fog('#FFF', start, end);
   }
   
   add(object) {
      this.object.add(object)
   }
   
   remove(object) {
      this.object.remove(object)
   }
   
   setBackground(color) {
      this.object.background = new THREE.Color(color)
   }
}
