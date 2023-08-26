import { c3 } from '../c3.js'

export class ObjectCylinder extends c3.Object {
   mesh() {
      const geo = new c3.THREE.CylinderGeometry( 1, 1, 5, 10 )
      const mat = new c3.THREE.MeshLambertMaterial({ color: '#F66' })
      const mes = new c3.THREE.Mesh(geo, mat)
      mes.receiveShadow = true
      mes.castShadow = true
      return mes
   }
   
   physics() {
      return {
         meshes: [{ mesh: this.mesh }],
         material: 'BOX',
         debug: true,
      }
   }
   
   create({ pos }) {
      this.setPositionVec(pos)
   }
}
