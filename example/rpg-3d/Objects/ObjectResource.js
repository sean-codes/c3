import { c3 } from '../c3.js'

export class ObjectResource extends c3.Object {
   mesh() {
      const type = c3.math.choose(['tree', 'rock', 'bush'])
      const model = c3.models.find(type).clone()
      
      let geo = new c3.THREE.BoxGeometry(1, 20, 1)
      if (type === 'rock' || type === 'bush') {
         geo = new c3.THREE.SphereGeometry(2)
      }
      const mat = c3.models.materialFind('WIREFRAME')
      const mes = new c3.THREE.Mesh(geo, mat)
      
      
      mes.add(model.object)
      return mes
   }
   
   physics() {
      return {
         meshes: [{ mesh: this.mesh }],
         material: 'GROUND',
         mass: 0
      }
   }
   
   create() {
      const randomPos = c3.math.randomPointFromPoint(new c3.Vector(0, 0, 0), c3.math.randomRange(40, 100))
      this.setPositionVec(randomPos)
   }
}
