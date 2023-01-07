import * as THREE from '../libs/three/build/three.module.mjs'

export class C3_Scene {
   constructor() {
      this.object = new THREE.Scene()
   }
   
   setFog(color, start, end) {
      this.object.fog = new THREE.Fog(color, start, end);
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
