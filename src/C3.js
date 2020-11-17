import * as THREE from '../node_modules/three/build/three.module.js'
import * as CANNON from '../node_modules/cannon-es/dist/cannon-es.js'
import { FBXLoader } from '../node_modules/three/examples/jsm/loaders/FBXLoader.js'
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js'

import { C3_Objects } from './C3_Objects.js'
import { C3_Camera } from './C3_Camera.js'
import { C3_Physics } from './C3_Physics.js'
import { C3_Render } from './C3_Render.js'
import { C3_Scene } from './C3_Scene.js'
import { C3_Keyboard } from './C3_Keyboard.js'
import { C3_Light } from './C3_Light.js'
import { C3_Mesh } from './C3_Mesh.js'
import { C3_Models } from './C3_Models.js'
import { C3_Mouse } from './C3_Mouse.js'
import { C3_Texture } from './C3_Texture.js'
import { C3_Textures } from './C3_Textures.js'
import * as C3_Math from './C3_Math.js'
import * as constants from './constants.js'
import { C3_Model } from './C3_Model.js'
import { C3_Object } from './C3_Object.js'
import { C3_Vector } from './C3_Vector.js'
import { C3_Network } from './C3_Network.js'
import { C3_Transform } from './C3_Transform.js'
import { C3_Fps } from './C3_Fps.js'

export { C3_Object } from './C3_Object.js'

export class C3 {
   constructor(options = undefined) {
      this.clock = new THREE.Clock()

      this.global = {}
      this.render = new C3_Render(this)
      this.camera = new C3_Camera(this)
      this.fps = new C3_Fps(this)
      this.objects = new C3_Objects(this)
      this.scene = new C3_Scene(this) // required for physics
      this.physics = new C3_Physics(this)
      this.models = new C3_Models(this)
      this.textures = new C3_Textures(this)
      this.keyboard = new C3_Keyboard(this)
      this.network = new C3_Network(this)
      this.transform = new C3_Transform(this)
      this.math = C3_Math
      this.Model = C3_Model
      this.Object = C3_Object
      this.Texture = C3_Texture
      this.Vector = C3_Vector
      this.light = new C3_Light
      this.mesh = new C3_Mesh(this)
      this.mouse = new C3_Mouse(this)
      this.THREE = THREE
      this.CANNON = CANNON
      this.const = constants
      this.script = {}
      
      this.loading = 0   
   }
   
   init({
      types = {},
      models = [],
      textures = [],
      scripts = {},
      keyMap = {},
      progress = () => {},
      init = () => {},
      step = () => {},
   } = {}) {
      this.keyMap = keyMap
      this.userInit = init
      this.userStep = step
      this.userProgress = progress
      this.types = types
      this.listModels = [...models]
      this.keyboard.applyKeyMap(keyMap)
      
      // applying cs to scripts
      for (const scriptName in scripts) {
         if (typeof scripts[scriptName] === 'object') {
            scripts[scriptName].cs = this
         }
         this.script[scriptName] = scripts[scriptName]
      }
      

      this.loadModels(models)
         .then(() => this.loadTextures(textures))
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
      
      this.userStep.call(this, this, delta)
      this.render.loop(this.scene, this.camera, delta)
      this.objects.loop(delta)
      
      this.physics.loop(delta)
      this.models.loop(delta)
      this.keyboard.resetKeys()
      this.network.updateMetrics()
      this.network.read()
      this.mouse.loop()
      this.fps.step()
   }

   handleResize(e) {
      const pixelRatio = 1 //window.devicePixelRatio
      const width = window.innerWidth * pixelRatio
      const height = window.innerHeight * pixelRatio

      this.render.handleResize(width, height)
      this.camera.handleResize(width, height)
   }
   
   // should move tihs to C3_Models.js
   loadModels(models) {
      const fbxLoader = new FBXLoader()
      const gltfLoader = new GLTFLoader()
      
      return new Promise((yay, nay) => {   
         let loading = models.length
         !loading && yay()
         
         for (const loadInfo of models) {
            const isGltf = loadInfo.file.includes('.gltf') || loadInfo.file.includes('.glb')
            const isFbx = loadInfo.file.includes('.fbx')
            const loader = isGltf ? gltfLoader : fbxLoader
            
            loader.load(loadInfo.file, (object) => {
               if (isGltf) { object = object.scene }
               this.models.add({ c3: this, loadInfo, object })
               if (loadInfo.log) console.log('Loaded Model', loadInfo.name, object)
               
               loading -= 1
               
               this.userProgress(1 - loading/models.length)
               if (!loading) yay()
            }, null, (e) => { throw e })
         }
      })
   }
   
   loadTextures(textures) {
      const loader = new THREE.TextureLoader()
      
      return new Promise((yay, nay) => {
         let loading = textures.length
         !loading && yay()
         
         for (const loadInfo of textures) {
            loader.load(loadInfo.file, texture => {
               this.textures.add({ c3: this.c3, loadInfo, texture })
               if (loadInfo.log) console.log('Loaded Texture', loadInfo.name, texture)
               
               
               loading -= 1
               if (!loading) yay()
            })
         }
      })
   }
}
