// import { C3_Object } from '../../C3.js' // this might be required since we cant get c3 before load
import { c3, C3_Object, TYPES } from './c3.js' // i also like this?
// console.log(engine);


export class ObjectCube extends C3_Object {
   model() {
      const geo = new c3.three.BoxGeometry(1, 1, 1)
      const mat = new c3.three.MeshPhongMaterial({ color: 'red' })
      return new c3.three.Mesh(geo, mat)
   }
   
   create({ anAttribute }) {
      
   }

   step() {
      // console.log('cube step')
   }

   outer() {
      // console.log('outer')
   }
}
