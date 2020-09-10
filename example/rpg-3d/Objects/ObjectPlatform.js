import { c3 } from '../c3.js'

export class ObjectPlatform extends c3.Object {
   mesh() {
      const geo = new c3.three.BoxBufferGeometry(10, 0.5, 10)
      const mat = c3.models.materialFind('BOX')
      const mes = new c3.three.Mesh(geo, mat)
      mes.receiveShadow = true
      mes.castShadow = true
      
      return mes
   }
   
   physics() {
      return {
         meshes: [{ mesh: this.mesh }],
         material: 'BOX',
         mass: 0
      }
   }
   
   create({ pos }) {
      this.setPositionVec(pos)
   }
}
