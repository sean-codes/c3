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
      
      this.controls.mode = MODES.scale
      this.controls.addEventListener('change', (e) => this.handleChange(e))
   }
   
   
   attach(gameObject) {
      this.gameObject = gameObject
      const currentPosition = gameObject.getPosition()
      const currentRotation = gameObject.getRotation()
      const currentScale = gameObject.getScale()
      this.pointer.position.copy(currentPosition)
      this.pointer.rotation.copy(currentRotation)
      this.pointer.scale.copy(currentScale)
      c3.scene.add(this.pointer)
      c3.scene.add(this.controls)
      
      // console.log('attached', gameObject, currentPosition, currentRotation, currentScale)
   }
   
   detach() {
      c3.scene.remove(this.pointer)
      c3.scene.remove(this.controls)
   }
   
   handleChange(e) {
      this.gameObject.setPositionVec(this.pointer.position)
      this.gameObject.setPositionVec(this.pointer.position)
      this.gameObject.setScaleVec(this.pointer.scale)
   }
}
