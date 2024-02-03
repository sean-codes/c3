import { c3 } from '../c3.js'

export class ObjectLight extends c3.Object {
   mesh() {

      return c3.light.Ambient({ color: '#FFF', intensity: 1.5})
   }
   
   create() {
      this.setPosition(0, 0, 0)
   }
}
