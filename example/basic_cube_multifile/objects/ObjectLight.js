import { C3_Object } from '../c3.js'

export class ObjectLight extends C3_Object {
   object() {
      return this.c3.light.Directional()
   }
   
   create() {
      this.setPosition(0, 5, 5)
   }
}
