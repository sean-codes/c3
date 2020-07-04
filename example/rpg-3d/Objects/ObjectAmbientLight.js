import { c3 } from '../c3.js'

export class ObjectAmbientLight extends c3.Object {
   mesh() {
      const ambientLight = new c3.three.AmbientLight('#FFF', 0.5)
      return ambientLight
   }
   
   create() {
      
   }
}
