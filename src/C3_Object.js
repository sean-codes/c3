import * as THREE from '../node_modules/three/build/three.module.js'
import { C3_Vector } from './C3_Vector.js'
import * as C3_Mesh from './C3_Mesh.js'

export class C3_Object {
   constructor(c3, id, attr, type) {
      this.c3 = c3
      this.id = id
      this.attr = attr || {}
      this.type = type
      this.rotation = new THREE.Euler(0, 0, 0)
      this.origin = new THREE.Object3D()
      this.mesh = this.mesh ? this.mesh() : c3.mesh.Blank()
      this.origin.C3_Object = this // might be handy for querying
      this.origin.add(this.mesh)
      this.physics = this.physics ? this.physics() : { meshes: [] }
      this.physicsObject = this.physics.meshes.length ? c3.physics.addObject(this) : undefined
      this.body = this.physicsObject ? this.physicsObject.body : undefined
      
      this.create(this.attr)
   }

   destroy() {
      this.c3.scene.remove(this.origin)
      if (this.physicsObject) this.c3.physics.removeObject(this.physicsObject)
      this.c3.objects.destroy(this)
      this.onDestroy && this.onDestroy()
   }
   
   setPosition(x, y, z) {
      if (this.body && !this.physics.linkToMesh) {
         this.body.position.x = x + this.physicsObject.offset.x
         this.body.position.y = y + this.physicsObject.offset.y
         this.body.position.z = z + this.physicsObject.offset.z
      } else {
         this.origin.position.y = y
         this.origin.position.z = z
         this.origin.position.x = x
      }
      
   }
   
   moveVec({ x, y, z }) {
      if (this.body && !this.physics.linkToMesh) {
         this.body.position.x += x
         this.body.position.y += y
         this.body.position.z += z
      } else {
         this.origin.position.x += x
         this.origin.position.y += y
         this.origin.position.z += z
      }
   }
   
   setPositionVec({ x, y, z }) {
      this.setPosition(x, y, z)
   }

   getPosition() {
      return this.origin.position.clone()
   }
   
   getVelocity() {
      return this.body.velocity.clone()
   }
   
   setVelocity(x, y, z) {
      this.body.velocity.set(x, y, z)
   }
   
   setVelocityVec(vec) {
      this.body.velocity.set(vec.x, vec.y, vec.z)
   }

   rotate(x, y, z) {
      this.origin.rotation.x += x
      this.origin.rotation.y += y
      this.origin.rotation.z += z
      this.rotateUpdate()
   }

   rotateX(radians) {
      this.rotation.x += radians
      this.rotateUpdate()
   }

   rotateY(radians) {
      this.rotation.y += radians
      this.rotateUpdate()
   }

   rotateZ(radians) {
      this.rotation.z += radians
      this.rotateUpdate()
   }

   setRotationY(radians) {
      this.rotation.y = radians
      this.rotateUpdate()
   }

   setRotationVec(rotation) {
      this.rotation.x = rotation.x
      this.rotation.y = rotation.y
      this.rotation.z = rotation.z
      this.rotateUpdate()
   }
   
   setScaleVec(scale) {
      this.origin.scale.copy(scale)
      this.scaleUpdate()
   }
   
   getScale() {
      return this.origin.scale
   }

   getRotation() {
      return this.rotation
   }

   getDirection() {
      return this.origin.getWorldDirection(new THREE.Vector3())
   }

   addRotationY(radians) {
      this.rotation.y = this.c3.math.loopAngle(this.rotation.y + radians)
      this.rotateUpdate()
   }

   rotateUpdate() {
      if (!this.body || (this.physics && this.physics.linkToMesh)) {
         this.origin.rotation.x = this.rotation.x
         this.origin.rotation.y = this.rotation.y
         this.origin.rotation.z = this.rotation.z
      } else {
         // we need to make this work for offsets
         
         
         this.body.quaternion.setFromEuler(
            this.rotation.x, 
            this.rotation.y, 
            this.rotation.z, 
            'XYZ')
      }
   }
   
   scaleUpdate() {
      const { c3 } = this
      // we need to update physics if there is a body
      if (this.body) {
         c3.physics.removeObject(this)
         this.physicsObject = c3.physics.addObject(this)
         this.body = this.physicsObject.body
      }
   }

   getCollisions() {
      return this.physicsObject.collisions
   }
   
   getIsOnGround() {
      return this.physicsObject && this.physicsObject.isOnGround
   }

   create() {}
   step() {}

}
