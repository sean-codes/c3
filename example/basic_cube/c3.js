// I'm creating this file because it helps autocomplete
// It's also so I can pass the types/globals around easily

import { C3, C3_Object } from '../../C3.js'
import { ObjectCube } from './ObjectCube.js'
// c3.three.

export const KEYMAP = {
  spacbar: 32
}

export const TYPES = {
  cube: ObjectCube
}

export const SHARED = {
  hi: 'hello'
}

export { C3_Object }
export const c3 = new C3()

if (typeof window !== 'undefined') {
   window.c3 = c3
   window.TYPES = TYPES
   window.KEYMAP = KEYMAP
   window.SHARED = SHARED
}
