import { c3, KEYMAP } from '../c3.js'



export class ObjectCamera extends c3.Object {
   mesh() {
      const { camera } = c3
      camera.setPosition(0, 0, 0)
      camera.lookAt(0, 0, 0)
      
      this.camera = camera.object
      this.xRot = new c3.THREE.Object3D()
      this.yRot = new c3.THREE.Object3D()
      this.xRot.rotation.x += 0
      
      this.yRot.add(this.xRot)
      this.xRot.add(camera.object)
      return this.yRot
   }
   
   create({ pos }) {
      this.zoom = 15
      this.setPositionVec(pos)
      this.lookAt(new c3.Vector(0, 0, 0))
      
      window.addEventListener('mousewheel', (e) => {
         this.xRot.rotation.x += e.deltaY/100
         this.yRot.rotation.y += e.deltaX/100
      })
   }
   
   step() {
      // save the position to reapply after moving zoom/xRot
      const storePosition = this.camera.getWorldPosition(new c3.THREE.Vector3())
      this.camera.position.z = 0
      this.xRot.position.y = 0
      this.setPositionVec(storePosition)
      
      const speed = 0.5
      const direction = this.camera.getWorldDirection(new c3.THREE.Vector3()).multiplyScalar(0.25)
      const unturned = new c3.THREE.Vector3(direction.x, 0, direction.z).normalize()
      const flat = new c3.THREE.Vector2(direction.x, direction.z)
      const angle = flat.angle() + Math.PI*0.5
      const turned = new c3.THREE.Vector3(Math.cos(angle)*0.25, 0, Math.sin(angle)*0.25).normalize()
      
      if (c3.keyboard.check(KEYMAP.forward).held) {
         this.moveVec(unturned.clone().multiplyScalar(speed))
      }
      
      if (c3.keyboard.check(KEYMAP.backward).held) {
         this.moveVec(unturned.clone().multiplyScalar(-speed))
      }
      
      if (c3.keyboard.check(KEYMAP.left).held) {
         this.moveVec(turned.clone().multiplyScalar(-speed))
      }
      
      if (c3.keyboard.check(KEYMAP.right).held) {
         this.moveVec(turned.clone().multiplyScalar(speed))
      }
      
      if (c3.keyboard.check(KEYMAP.flyUp).held) {
         this.moveVec(new c3.Vector(0, 1, 0))
      }
      
      if (c3.keyboard.check(KEYMAP.flyDown).held) {
         this.moveVec(new c3.Vector(0, -1, 0))
      }
      
      const objects = c3.mouse.raycast()
      // console.log(objects)
      for (let { object } of objects) {
         if (object.blockSelect) continue
         
         // for indicating what the ray is on
         object.setRotation(0, 0, 0)
         object.setScale(2, 2, 2)
         
         if (c3.mouse.isDown()) {
            c3.transform.enable()
            c3.transform.attach(object)
            break
         }
      }
      
      if (c3.keyboard.check(KEYMAP.del).down) {
         const transformObject = c3.transform.getObject()
         if (transformObject) {
            transformObject.destroy()
         }
      }  

      if (c3.mouse.isDown()) {

         // const newObject = c3.objects.create(c3.types.model, { pos: new c3.Vector(0, 0, 0) })
      }

      if (c3.keyboard.check(KEYMAP.add).down) {
         console.log('done')
         const newObject = c3.objects.create(c3.types.model, { pos: new c3.Vector(0, 0, 0) })
         // c3.transform.attach(newObject)
      }
      
   }
   
   lookAt(pos) {
      // i dont know if this is right :<
      const direction = this.getPosition().sub(pos)
      
      const targetAngleY = c3.math.loopAngle(new c3.THREE.Vector2(-direction.x, direction.z).angle() - (Math.PI/2))
      const newAngleY = c3.math.angleToAngle(this.rotation.y, targetAngleY)
      this.yRot.rotation.y = newAngleY
      
      const targetAngleX = c3.math.loopAngle(new c3.THREE.Vector2(direction.y, direction.z).angle() - (Math.PI/2))
      const newAngleX = c3.math.angleToAngle(this.rotation.x, targetAngleX)
      this.xRot.rotation.x = newAngleX
   }
}
