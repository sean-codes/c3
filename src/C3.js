import * as THREE from '../node_modules/three/build/three.module.js'
import { C3_Objects } from './C3_Objects.js'
import { C3_Camera } from './C3_Camera.js'
import { C3_Physics } from './C3_Physics.js'
import { C3_Render } from './C3_Render.js'
import { C3_Scene } from './C3_Scene.js'
import { C3_Vector } from './C3_Vector.js'
import { C3_Light } from './C3_Light.js'
import { C3_Mesh } from './C3_Mesh.js'
import * as C3_Math from './C3_Math.js'
import { C3_Object } from './C3_Object.js'

export { C3_Object } from './C3_Object.js'
export * from './constants.js'

export class Engine {
   constructor({
      types = {},
      models = [],
      keyMap = {},
      init = () => {},
      step = () => {},
   } = {}) {
      this.keyMap = keyMap
      this.userInit = init
      this.userStep = step
      this.types = types
      this.models = models

      this.clock = new THREE.Clock()

      this.global = {}
      this.render = new C3_Render
      this.camera = new C3_Camera
      this.objects = new C3_Objects(this)
      this.physics = new C3_Physics
      this.scene = new C3_Scene
      this.math = C3_Math
      this.Object = C3_Object
      this.Vector = C3_Vector
      this.light = new C3_Light
      this.mesh = new C3_Mesh
      this.three = THREE

      this.engineInit()
   }

   clone(object) {
      return JSON.parse(JSON.stringify(object))
   }

   engineInit() {
      console.log('adding camera', this.camera.object)
      this.scene.add(this.camera.object)

      window.onresize = () => this.handleResize()
      this.handleResize()

      this.userInit.call(this)
      this.engineStep()
   }

   engineStep() {
      typeof window !== 'undefined' ?
         requestAnimationFrame(() => this.engineStep()) :
         setTimeout(() => this.engineStep(), 1000 / 60)

      const delta = this.clock.getDelta()
      this.userStep.call(this, delta)
      this.render.loop(this.scene, this.camera, delta)
      this.objects.loop(delta)
   }

   handleResize(e) {
      const pixelRatio = 1 //window.devicePixelRatio
      const width = window.innerWidth * pixelRatio
      const height = window.innerHeight * pixelRatio

      this.render.handleResize(width, height)
      this.camera.handleResize(width, height)
   }
}
