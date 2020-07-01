import { C3_Object } from './src/C3_Object.js'
import { C3_Objects } from './src/C3_Objects.js'
import * as C3_Math from './src/C3_Math.js'

class C3 {
  constructor() {
    this.create()
    
    this.global = {}
    this.objects = new C3_Objects
    this.Object = C3_Object
    this.math = C3_Math
  }
  
  create() {
    console.log('no creationscript!')
  }
}

export {
  C3,
  C3_Object,
  C3_Math,
}