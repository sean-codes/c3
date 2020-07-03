import { c3, C3_Object } from '../c3.js'

export class ObjectAmbientLight extends C3_Object {
   mesh() {
      return new c3.three.AmbientLight('#FFF', 0.5)
   }
}
