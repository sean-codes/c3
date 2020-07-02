// I'm creating this file because it helps autocomplete
// It's also so I can pass the types/globals around easily

import { C3, C3_Object } from '../../C3.js'
import { ObjectCube } from './ObjectCube.js'


class Engine extends C3 {
  constructor() {
      super()
      
      this.types = {
        cube: ObjectCube
      }
      
      this.global = {
        hi: 'hello'
      }
  }

  start() {
    
  }
  
  step() {
    // console.log('meow')
  }
}

export { C3_Object }
export const c3 = new Engine
if (typeof window !== 'undefined') window.c3 = c3
