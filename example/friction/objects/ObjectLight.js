import { c3 } from '../c3.js'

export class ObjectLight extends c3.Object {
   mesh() {
      const container = new c3.THREE.Object3D()
      const ambient = c3.light.Ambient({
         color: '#FFF',
         intensity: 0.25,
      })
      const directional = this.c3.light.Directional()

      container.add(ambient)
      container.add(directional)

      return container
   }
   
   create() {
      this.setPosition(0, 5, 5)
   }
}
