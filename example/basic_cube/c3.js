import { C3, C3_Object } from '../../C3.js'
import { ObjectCube } from './objects/ObjectCube.js'
import { ObjectAmbientLight } from './objects/ObjectAmbientLight.js'
import { ObjectDirectionalLight } from './objects/ObjectDirectionalLight.js'

export const TYPES = {
  cube: ObjectCube,
  ambientLight: ObjectAmbientLight,
  directionalLight: ObjectDirectionalLight,
}

export { C3_Object }
export const c3 = new C3()

if (typeof window !== 'undefined') {
   window.c3 = c3
   window.TYPES = TYPES
}

c3.scene.setBackground('#555')
c3.camera.setPosition(0, 0, 5)

c3.objects.create(TYPES.cube)
c3.objects.create(TYPES.ambientLight)
// c3.objects.add(TYPES.directionalLight)
