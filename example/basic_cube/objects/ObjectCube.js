import { c3, C3_Object, TYPES } from '../c3.js'


export class ObjectCube extends C3_Object {
   mesh() {
      const geo = new c3.three.BoxGeometry(1, 1, 1)
      const mat = new c3.three.MeshPhongMaterial({ color: '#F22' })
      return new c3.three.Mesh(geo, mat)
   }
   
   create({ anAttribute }) {
      c3.objects.create(TYPES.directionalLight)
   }

   step() {
      this.rotateX(0.01)
      this.rotateY(0.01)
   }

   outer() {
      // console.log('outer')
   }
}
