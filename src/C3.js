import * as THREE from '../node_modules/three/build/three.module.js'
import { C3_Objects } from './C3_Objects.js'
import { C3_Camera } from './C3_Camera.js'
import { C3_Physics } from './C3_Physics.js'
import { C3_Render } from './C3_Render.js'
import { C3_Scene } from './C3_Scene.js'
import { C3_Keyboard } from './C3_Keyboard.js'
import { C3_Light } from './C3_Light.js'
import { C3_Mesh } from './C3_Mesh.js'
import { C3_Models } from './C3_Models.js'
import * as C3_Math from './C3_Math.js'
import * as constants from './constants.js'
import { C3_Model } from './C3_Model.js'
import { C3_Object } from './C3_Object.js'
import { C3_Vector } from './C3_Vector.js'

export { C3_Object } from './C3_Object.js'

export class C3 {
   constructor(options = undefined) {
      this.clock = new THREE.Clock()

      this.global = {}
      this.render = new C3_Render(this)
      this.camera = new C3_Camera(this)
      this.objects = new C3_Objects(this)
      this.physics = new C3_Physics(this)
      this.scene = new C3_Scene(this)
      this.models = new C3_Models(this)
      this.keyboard = new C3_Keyboard(this)
      this.math = C3_Math
      this.Model = C3_Model
      this.Object = C3_Object
      this.Vector = C3_Vector
      this.light = new C3_Light
      this.mesh = new C3_Mesh
      this.three = THREE
      this.const = constants
      
      if (options) this.init(options)   
   }
   
   init({
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
      this.listModels = [...models]
      this.keyboard.applyKeyMap(keyMap)
      
      this.models.load(models)
         .then(() => this.engineInit())
   }

   clone(object) {
      return JSON.parse(JSON.stringify(object))
   }

   engineInit() {
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
      
      this.physics.loopApplyCollisions()
      
      this.userStep.call(this, delta)
      this.render.loop(this.scene, this.camera, delta)
      this.objects.loop(delta)
      
      this.physics.loop(delta)
      this.models.loop(delta)
      this.keyboard.resetKeys()
   }

   handleResize(e) {
      const pixelRatio = 1 //window.devicePixelRatio
      const width = window.innerWidth * pixelRatio
      const height = window.innerHeight * pixelRatio

      this.render.handleResize(width, height)
      this.camera.handleResize(width, height)
   }
}
