// import { C3_Object } from '../../C3.js' // this might be required since we cant get c3 before load
import { c3, C3_Object } from './c3.js' // i also like this?
// console.log(engine);


export class ObjectCube extends C3_Object {
  create({ anAttribute }) {
    // c3.global.
    console.log('hello', anAttribute, c3);
    // console.log(c3.math.iRandom(6))
    // console.log(C3_Math.iRandom(6))
    // console.log(TYPES)
    console.log(c3.types)
    c3.math.iRandomRange(1, 2)
    this.move(7, 4)
    // this.outer()
    
    // c3.global
  }
  
  step() {
    // console.log('cube step')
  }
  
  outer() {
    // console.log('outer')
  }
}