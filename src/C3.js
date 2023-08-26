import * as THREE from '../libs/three/build/three.module.js'
import * as CANNON from '../libs/cannon-es/dist/cannon-es.js'
import { FBXLoader } from '../libs/three/examples/jsm/loaders/FBXLoader.js'
import { GLTFLoader } from '../libs/three/examples/jsm/loaders/GLTFLoader.js'

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
import { C3_Storage } from './C3_Storage.js'
import { C3_Gamepad } from './C3_Gamepad.js'
import { C3_Html } from './C3_Html.js'

export class C3 {
   constructor(options = undefined) {
      this.clock = new THREE.Clock()
      
      this.global = {}
      this.camera = new C3_Camera(this)
      this.scene = new C3_Scene(this) // required for physics
      this.render = new C3_Render(this)
      this.fps = new C3_Fps(this)
      this.objects = new C3_Objects(this)
      this.physics = new C3_Physics(this)
      this.models = new C3_Models(this)
      this.textures = new C3_Textures(this)
      this.keyboard = new C3_Keyboard(this)
      this.gamepad = new C3_Gamepad(this)
      this.network = new C3_Network(this)
      this.transform = new C3_Transform(this)
      this.html = new C3_Html(this)
      this.math = C3_Math
      this.Model = C3_Model
      this.Object = C3_Object
      this.Texture = C3_Texture
      this.Vector = C3_Vector
      this.light = new C3_Light
      this.mesh = new C3_Mesh(this)
      this.mouse = new C3_Mouse(this)
      this.storage = new C3_Storage(this)
      this.THREE = THREE
      this.CANNON = CANNON
      this.const = constants
      this.lastInputType = constants.INPUT_KEYBOARD
      this.script = {}
      this.version = 0
      this.loading = 0   
      this.engineSpeed = 1000/60
      this.screenWidth = 0
      this.screenHeight = 0
   }
   
   init({
      types = {},
      models = [],
      textures = [],
      storages = [],
      scripts = {},
      keyMap = {},
      progress = () => {},
      init = () => {},
      step = () => {},
      onInput = () => {},
      version = Math.random(),
   } = {}) {
      this.version = version
      this.keyMap = keyMap
      this.userInit = init
      this.userStep = step
      this.userProgress = progress
      this.userOnInput = onInput
      this.types = types
      this.storages = storages
      this.listModels = [...models]
      this.keyboard.applyKeyMap(keyMap)
      this.running = true
      this.loops = 0
      
      // applying c3 to scripts
      for (const scriptName in scripts) {
         if (typeof scripts[scriptName] === 'object') {
            scripts[scriptName].c3 = this
         }
         this.script[scriptName] = scripts[scriptName]
      }
      

      this.loadModels(models)
         .then(() => this.loadStorages(storages))
         .then(() => this.loadTextures(textures))
         .then(() => this.engineInit())
         .catch(console.error)
   }
   
   clone(object) {
      return JSON.parse(JSON.stringify(object))
   }

   engineInit() {
      this.scene.add(this.camera.object)
      window.onresize = () => this.handleResize()
      this.handleResize()

      this.storage.init(this.storages)
      this.userInit.call(this)
      this.engineStep()
      
   }

   engineStep() {
      // delta bits
      const oneSec = 1000/60
      const timeScale = 1/ (this.engineSpeed / oneSec)
      
      // for debugging lower fps
      const useAnimationFrame = window.requestAnimationFrame && this.engineSpeed === 1000/60
      
      useAnimationFrame
         ? requestAnimationFrame(() => this.engineStep()) 
         : setTimeout(() => this.engineStep(), this.engineSpeed)
         
      // run this even if stopped
      this.gamepad.loop()
      
      if (!this.running) return
      
      const delta = this.clock.getDelta()
      
      this.physics.loopApplyCollisions()
      
      this.userStep.call(this, this, delta)
      this.render.loop(this.scene, this.camera, delta)
      this.html.loop(this.scene, this.camera, delta)
      this.objects.loop(delta)
      
      this.physics.loop(delta)
      this.models.loop(delta*timeScale)
      this.keyboard.resetKeys()
      
      this.network.updateMetrics()
      this.network.read()
      this.mouse.loop()
      this.fps.step()
      this.transform.step()
      
      this.loops += 1
   }
   
   stop() {
      this.running = false
   }
   
   start() {
      this.running = true
   }

   handleResize(e) {
      const pixelRatio = 1 //window.devicePixelRatio
      const width = window.innerWidth * pixelRatio
      const height = window.innerHeight * pixelRatio
      this.screenWidth = width
      this.screenHeight = height
      this.render.handleResize(width, height)
      this.camera.handleResize(width, height)
      this.html.handleResize(width, height)
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
               if (isGltf) { 
                  // need to revist, animations for gltf not working right
                  const obj = new THREE.Object3D()
                  obj.add(object.scene)
                  obj.animations = object.animations
                  object = obj; 
               }
               
               // multiple models in a single file
               if (loadInfo.models) {
                  for (let modelLoadInfo of loadInfo.models) {
                     let modelObject = undefined
                     object.traverse(p => {
                        if(p.name === modelLoadInfo.name) modelObject = p
                     })
                     this.models.add({ c3: this, loadInfo: modelLoadInfo, object: modelObject })
                  }
               } else {
                  this.models.add({ c3: this, loadInfo, object })
               }
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
   
   loadStorages(storages) {
      return new Promise((yay, nay) => {
         let loading = storages.length
         !loading && yay()
         
         function handleLoadedStorage() {
            loading -= 1
            if (!loading) {
               yay()
            }
         }
         
         for (const storage of storages) {
            storage.data = {}

            // attempt to use localstorage
            if (!storage.file) {
               storage.data = JSON.parse(window.localStorage.getItem(storage.location))
               handleLoadedStorage()
            }

            // fetch the storage .json
            if (storage.file) {
               storage.request = new XMLHttpRequest()
               storage.request.onreadystatechange = () => {
                  if (storage.request.readyState === 4) {
                     const data = JSON.parse(storage.request.responseText)
                     storage.data = data
                     handleLoadedStorage()
                  }
               }

               storage.request.open('GET', './' + storage.file + '?v=' + this.version, true)
               storage.request.send()
            }
         }
      })
   }
}
