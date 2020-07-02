import { C3_Object } from './src/C3_Object.js'
import { C3_Objects } from './src/C3_Objects.js'
import { C3_Physics } from './src/C3_Physics.js'
import * as C3_Math from './src/C3_Math.js'

class C3 {
  constructor() {
    
    this.global = {}
    this.objects = new C3_Objects
    this.physics = new C3_Physics
    this.Object = C3_Object
    this.math = C3_Math
    
    console.log('hello?')
    setTimeout(() => this.engineStep(), 1)
    // this.step()
  }
  
  
  engineStep() {
    (typeof window !== 'undefined')
      ? requestAnimationFrame(() => this.engineStep())
      : setTimeout(() => this.engineStep(), 1000/60)

    this.objects.loop()
    
  }
  
  step() {
    // console.log('why not?')
    
    // console.log('test')
  }
}

export {
  C3,
  C3_Object,
  C3_Math,
}