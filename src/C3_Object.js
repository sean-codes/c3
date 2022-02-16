import * as THREE_IMPORT from '../node_modules/three/build/three.module.js'
 /** @type {import("../node_modules/three") } */
const THREE = THREE_IMPORT

export class C3_Object {
   constructor(c3, id, attr, type) {
      this.c3 = c3
      this.id = id
      this.attr = attr || {}
      this.type = type
      this.rotation = new THREE.Euler(0, 0, 0)
      this.origin = new THREE.Object3D()
      this.origin.C3_Object = this // might be handy for querying
      
      // turn this into something? 
      this.mesh = this.mesh ? this.mesh() : c3.mesh.Blank()
      if (!this.mesh.isInstance) {
         this.origin.add(this.mesh.object || this.mesh)
      }
      
      this.physics = this.physics ? this.physics() : { meshes: [] }
      this.physicsObject = this.physics.meshes.length ? c3.physics.addObject(this) : undefined
      this.body = this.physicsObject ? this.physicsObject.body : undefined
      
      this.create(this.attr)
   }

   destroy() {
      this.c3.scene.remove(this.origin)
      if (this.physicsObject) this.c3.physics.removeObject(this.physicsObject)
      this.c3.objects.destroy(this)
      if (this.mesh.isInstance) {
         this.mesh.model.deleteInstance(this.mesh.id)
      }
      
      const transformObject = this.c3.transform.getObject() 
      if (transformObject && transformObject.id === this.id) {
         this.c3.transform.detach()
      }
      
      this.onDestroy && this.onDestroy()
   }
   
   setPosition(x, y, z) {
      this.origin.position.y = y
      this.origin.position.z = z
      this.origin.position.x = x
      
      if (this.body && !this.physics.linkToMesh) {
         this.body.position.x = x + this.physicsObject.offset.x
         this.body.position.y = y + this.physicsObject.offset.y
         this.body.position.z = z + this.physicsObject.offset.z
      }
   }
   
   moveVec({ x, y, z }) {
      this.origin.position.x += x
      this.origin.position.y += y
      this.origin.position.z += z
      
      if (this.body && !this.physics.linkToMesh) {
         this.body.position.x += x
         this.body.position.y += y
         this.body.position.z += z
      }
   }
   
   setPositionVec({ x, y, z }) {
      this.setPosition(x, y, z)
   }

   /**
   * @returns {THREE.Vector3}
   */
   getPosition() {
      return this.origin.position.clone()
   }
   
   // mmmm... i dont like these here!
   getVelocity() {
      return this.body.velocity.clone()
   }
   
   setVelocity(x, y, z) {
      this.body.velocity.set(x, y, z)
   }
   
   setVelocityVec(vec) {
      this.body.velocity.set(vec.x, vec.y, vec.z)
   }
   
   setMass(mass) {
      if (this.body) {
         this.body.mass = mass
         this.body.updateMassProperties()
      }
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
   
   setRotation(x, y, z) {
      this.rotation.x = x
      this.rotation.y = y
      this.rotation.z = z
      this.rotateUpdate()
   }
   
   setRotationVec({ x, y, z}) {
      this.setRotation(x, y, z)
   }
   
   setScale(x, y, z) {
      this.origin.scale.x = x
      this.origin.scale.y = y
      this.origin.scale.z = z
      this.scaleUpdate()
   }
   
   setScaleVec({ x, y, z}) {
      this.setScale(x, y, z)
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
      this.onResize()
      if (this.body) {
         c3.physics.removeObject(this)
   
         this.physicsObject = c3.physics.addObject(this)
         this.body = this.physicsObject.body
         this.rotateUpdate() // should probably be in ^ (i tried)
      }
   }

   getCollisions() {
      return this.physicsObject.collisions
   }
   
   getIsOnGround() {
      return this.physicsObject && this.physicsObject.isOnGround
   }
   
   setIsOnGround(bool) {
      this.physicsObject.isOnGround = bool
   }
   
   setFriction(friction) {
      if (this.physicsObject) this.physicsObject.material.friction = friction
   }
   
   getSize() {
      const box = new THREE.Box3()
      box.setFromObject(this.origin)
      
      return box.getSize(new THREE.Vector3)
   }
   
   engineStep() {
      if (this.mesh && this.mesh.isInstance) {
         
         const { instanceData } = this.mesh.model
         // const offsetScaled = instanceData.offset.clone().multiply(this.getScale())
         // this.origin.position.add(offsetScaled)
         // console.log(instanceData)
         // console.log(this.origin.position, this.origin.scale)
         this.origin.updateMatrix()
         const instanceId = instanceData.idMap[this.mesh.id]
         instanceData.mesh.setMatrixAt(instanceId, this.origin.matrix)
         instanceData.mesh.instanceMatrix.needsUpdate = true
         // this.origin.position.sub(offsetScaled)
      }
   }
   
   onResize() {}
   create() {}
   step() {}

}
