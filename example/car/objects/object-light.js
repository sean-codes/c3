import { c3 } from '../c3.js'

export class ObjectLight extends c3.Object {
   mesh() {

      var container = c3.mesh.Blank()
      container.add(c3.light.Ambient({ color: '#FFF', intensity: 1}))
      container.add(c3.light.Directional())
      return container
   }
   
   create() {
      this.setPosition(0, 0, 0)
   }
}
