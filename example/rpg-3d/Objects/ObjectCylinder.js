import { c3 } from '../c3.js'

export class ObjectCylinder extends c3.Object {
   mesh() {
      const geo = new c3.three.CylinderGeometry( 1, 1, 5, 10 )
      const mat = new c3.three.MeshLambertMaterial({ color: '#F66' })
      const mes = new c3.three.Mesh(geo, mat)
      mes.receiveShadow = true
      mes.castShadow = true
      return mes
   }
   
   physics() {
      return {
         meshes: [ this.mesh ],
         material: 'BOX'
      }
   }
   
   create({ pos }) {
      this.setPositionVec(pos)
   }
}
