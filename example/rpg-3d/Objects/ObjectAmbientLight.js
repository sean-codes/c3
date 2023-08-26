import { c3 } from '../c3.js'

export class ObjectAmbientLight extends c3.Object {
   mesh() {
      const ambientLight = new c3.THREE.AmbientLight('#FFF', 1)
      return ambientLight
   }
   
   create() {
      
   }
}
