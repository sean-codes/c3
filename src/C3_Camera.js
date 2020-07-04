import * as THREE from '../node_modules/three/build/three.module.js'

export class C3_Camera {
   constructor() {
      this.object = new THREE.PerspectiveCamera(45, 0, 0.001, 1000)
   }

   getWorldPosition() {
      return this.object.getWorldPosition(new THREE.Vector3())
   }

   distanceFrom(mesh) {
      return mesh.position.distanceTo(this.getWorldPosition())
   }

   setAspect(aspect) {
      this.object.aspect = aspect
      this.object.updateProjectionMatrix()
   }

   setPosition(x, y, z) {
      this.object.position.set(x, y, z)
   }

   setFar(far) {
      this.object.far = far
      this.object.updateProjectionMatrix()
   }

   setNearFar(near, far) {
      this.object.near = near
      this.object.far = far
      this.object.updateProjectionMatrix()
   }

   lookAt(x, y, z) {
      this.object.lookAt(x, y, z)
   }

   handleResize(width, height) {
      this.setAspect(width / height)
   }
}
