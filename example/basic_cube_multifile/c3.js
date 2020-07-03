import * as C3 from '../../C3.js'
import { ObjectCube } from './objects/ObjectCube.js'
import { ObjectLight } from './objects/ObjectLight.js'

// This is awful :]
export const c3 = new C3.Engine()
export { C3_Object } from '../../C3.js'

export const TYPES = {
  cube: ObjectCube,
  light: ObjectLight,
}

if (typeof window !== 'undefined') {
   window.c3 = c3
   window.TYPES = TYPES
}


// init
c3.mesh.setMaterialType(C3.MaterialTypePhong)
c3.camera.setPosition(0, 0, 2.5)
c3.objects.create(TYPES.light)
c3.objects.create(TYPES.cube)
