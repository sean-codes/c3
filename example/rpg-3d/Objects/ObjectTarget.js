import { c3 } from '../c3.js'

export class ObjectTarget extends c3.Object {
   mesh() {
      const geo = new c3.three.OctahedronGeometry(2, 0)
      const mat = c3.models.materialFind('TARGET')
      const mes = new c3.three.Mesh(geo, mat)
      
      mes.receiveShadow = true
      mes.castShadow = true
      return mes
   }
   
   create({ pos }) {
      this.setPositionVec(pos)
   }
   
   step() {
      
   }
}
