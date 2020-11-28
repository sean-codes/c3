import { c3 } from '../c3.js'

export class ObjectLight extends c3.Object {
   mesh() {
      return this.c3.light.Directional()
   }
   
   create() {
      this.setPosition(0, 5, 5)
   }
}
