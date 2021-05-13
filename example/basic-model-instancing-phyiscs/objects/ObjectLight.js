import { c3 } from '../c3.js'

export class ObjectLight extends c3.Object {
   mesh() {
      const container = new c3.THREE.Object3D()
      container.add(c3.light.Directional())
      container.add(c3.light.Ambient('#FFF', 0.5))
      return container
   }
   
   create() {
      this.setPosition(0, 5, 5)
   }
}
