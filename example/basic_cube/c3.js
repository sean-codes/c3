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
        hi: 1
      }
  }
  
  create() {
    console.log('starting')
    // new ObjectCube
    
    this.global = {
      test: '123',
      meow: 'cats',
    }
    
    GLOBAL.wtf = 'awdaw'
  }
}

export const GLOBAL = {
  hi: 1
}

export const TYPES = {
  cube: ObjectCube
}

export { C3_Object }
export const c3 = new Engine
window.c3 = c3
