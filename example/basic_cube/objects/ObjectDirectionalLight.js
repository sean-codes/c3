import { c3, C3_Object } from '../c3.js'

export class ObjectDirectionalLight extends C3_Object {
   mesh() {
      const directionalLight = new c3.three.DirectionalLight('#FFF')
      return directionalLight
   }
   
   create() {
      this.setPosition({ x: 5, y: 5, z: 0})
   }
}
