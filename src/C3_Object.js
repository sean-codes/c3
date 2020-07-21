import * as THREE from '../node_modules/three/build/three.module.js'
import { C3_Vector } from './C3_Vector.js'
import * as C3_Mesh from './C3_Mesh.js'

export class C3_Object {
   constructor(c3, id, attr, type) {
      this.c3 = c3
      this.id = id
      this.attr = attr || {}
      this.type = type
      
      this.rotation = new C3_Vector(0, 0, 0)
      this.mesh = this.mesh ? this.mesh() : c3.mesh.Blank()
      this.physics = this.physics ? this.physics() : { meshes: [] }
      this.physicsObject = this.physics.meshes.length ? c3.physics.addObject(this) : undefined
      this.body = this.physicsObject ? this.physicsObject.body : undefined

      this.create(this.attr)
   }

   destroy() {
      this.c3.scene.remove(this.mesh)
      if (this.physicsObject) this.c3.physics.removeObject(this.physicsObject)
      this.c3.objects.destroy(this)
   }

   setPosition(x, y, z) {
      if (this.body && !this.physics.linkToMesh) {
         this.body.position.x = x
         this.body.position.y = y
         this.body.position.z = z
      } else {
         this.mesh.position.x = x
         this.mesh.position.y = y
         this.mesh.position.z = z
      }
   }
   
   setPositionVec({ x, y, z }) {
      this.setPosition(x, y, z)
   }

   getPosition() {
      return this.mesh.position
   }
   
   getVelocity() {
      return this.body.velocity
   }
   
   setVelocity(x, y, z) {
      this.body.velocity.set(x, y, z)
   }
   
   setVelocityVec(vec) {
      this.body.velocity.set(vec.x, vec.y, vec.z)
   }

   rotate(x, y, z) {
      this.mesh.rotation.x += x
      this.mesh.rotation.y += y
      this.mesh.rotation.z += z
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

   setRotation(rotation) {
      this.rotation.x = rotation.x
      this.rotation.y = rotation.y
      this.rotation.z = rotation.z
      this.rotateUpdate()
   }

   getRotation() {
      return this.rotation
   }

   getDirection() {
      return this.mesh.getWorldDirection(new THREE.Vector3())
   }

   addRotationY(radians) {
      this.rotation.y = this.c3.math.loopAngle(this.rotation.y + radians)
      this.rotateUpdate()
   }

   rotateUpdate() {
      if (!this.body || (this.physics && this.physics.linkToMesh)) {
         this.mesh.rotation.x = this.rotation.x
         this.mesh.rotation.y = this.rotation.y
         this.mesh.rotation.z = this.rotation.z
      } else {
         this.body.quaternion.setFromEuler(this.rotation.x, this.rotation.y, this.rotation.z, 'XYZ')
      }
   }

   getCollisions() {
      return this.physicsObject.collisions
   }

   create() {}
   step() {}

}
