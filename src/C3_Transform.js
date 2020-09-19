import { TransformControls } from '../node_modules/three/examples/jsm/controls/TransformControls.js'
import * as THREE from '../node_modules/three/build/three.module.js'
const MODES = {
   translate: 'translate',
   rotate: 'rotate',
   scale: 'scale',
}

export class C3_Transform {
   constructor(c3) {
      this.c3 = c3
      this.controls = new TransformControls(
         c3.camera.object, 
         c3.render.renderer.domElement)
      this.pointer = new THREE.Object3D()
      this.controls.attach(this.pointer)
      this.gameObject = undefined
      this.gameObjectInitialTransform = {
         position: new THREE.Vector3(),
         scale: new THREE.Vector3(),
         rotation: new THREE.Euler(),
      }
      
      this.modeTranslate()
      this.controls.addEventListener('change', (e) => this.handleChange(e))
      this.controls.addEventListener('mouseDown', (e) => this.handleDown(e))
      this.controls.addEventListener('mouseup', (e) => this.handleUp(e))
   }
   
   
   attach(gameObject) {
      const currentPosition = gameObject.getPosition()
      console.log(currentPosition.x)
      const currentRotation = gameObject.getRotation()
      const currentScale = gameObject.getScale()
      
      if (!this.gameObject || this.gameObject.id !== gameObject.id) {
         this.gameObjectInitialTransform.position = currentPosition.clone()
         this.gameObjectInitialTransform.scale = currentScale.clone()
         this.gameObjectInitialTransform.rotation = currentRotation.clone()
      }
      
      this.pointer.position.copy(currentPosition)
      this.pointer.rotation.copy(currentRotation)
      this.pointer.scale.copy(currentScale)
      
      c3.scene.add(this.pointer)
      c3.scene.add(this.controls)
      
      this.controls.attach(this.pointer)
      this.gameObject = gameObject
      console.log('wtf', this.pointer.position)
   }
   
   detach() {
      this.gameObject = undefined
      this.controls.detach()
      c3.scene.remove(this.pointer)
      c3.scene.remove(this.controls)
   }
   
   // doens't remove the gameObject
   // handy to maintain gameObjectInitialTransform values
   hide() {
      this.controls.detach()
      c3.scene.remove(this.pointer)
      c3.scene.remove(this.controls)
   }
   
   show() {
      if (this.gameObject) {
         c3.scene.add(this.pointer)
         c3.scene.add(this.controls)
      }
   }
   
   handleDown(e) {
      this.c3.mouse.blockInput()
   }
   
   handleUp(e) {
      this.c3.mouse.blockInput()
   }
   
   handleChange() {
      if (!this.gameObject) return
      this.gameObject.setScaleVec(this.pointer.scale)
      this.gameObject.setPositionVec(this.pointer.position)
      this.gameObject.setRotationVec(this.pointer.rotation)
   }
   
   modeTranslate() {
      this.controls.mode = MODES.translate
   }
   
   modeScale() {
      this.controls.mode = MODES.scale
   }
   
   modeRotate() {
      this.controls.mode = MODES.rotate
   }
   
   undo() {
      const { position, rotation, scale } = this.gameObjectInitialTransform
      this.pointer.scale.copy(scale)
      this.pointer.position.copy(position)
      this.pointer.rotation.copy(rotation)
      this.handleChange()
   }
}
