import * as THREE from '../node_modules/three/build/three.module.js'

export class C3_Mouse {
   constructor(c3) {
      this.c3 = c3
      this.pos = new THREE.Vector3()
      this.raycaster = new THREE.Raycaster()
      this.events = []
      this.block = false
      this.down = false
      this.held = false
      this.up = false
      
      this.scrollX = 0
      this.scrollY = 0
      this.passThrough(window)
   }
   
   passThrough(ele) {
      ele.addEventListener('mousemove', (e) => this.handleMousemove(e))
      ele.addEventListener('mousedown', (e) => this.handleMousedown(e))
      ele.addEventListener('mouseup', (e) => this.handleMouseup(e))
      ele.addEventListener('mousewheel', (e) => {         
         this.scrollX += e.deltaX
         this.scrollY += e.deltaY
      })
   }
   
   handleMousemove(e) {
      this.pos.x = event.clientX / window.innerWidth * 2 - 1
      this.pos.y = event.clientY / window.innerHeight * -2 + 1;
   }
   
   handleMousedown(e) {
      if (this.block) return
      this.events.push({ down: true, held: true })
   }
   
   handleMouseup(e) {
      if (this.block) return
      this.events.push({ up: true, held: false })
   }
   
   blockInput() {
      this.block = true
   }
   
   loop() {
      this.block = false
      this.down = false
      if (this.up) this.held = false
      this.up = false
      this.scrollX = 0
      this.scrollY = 0
      for (const event of this.events) {
         for (const eventName in event) {
            this[eventName] = event[eventName]
         }
      }
      
      this.events = []
      // console.log(c3.mouse.down, c3.mouse.up, c3.mouse.held)
   }
   
   isDown() {
      return this.down
   }
   
   isUp() {
      return this.isUp
   }

   raycast() {
      // TODO: cache this incase it's called more than once per step
      this.raycaster.setFromCamera(this.pos, this.c3.camera.object)
      const intersects = this.raycaster.intersectObjects(this.c3.scene.object.children, true)
      // console.log(intersects)
      // match the intersects up with C3_Objects
      const returnIntersects = {} // for unique
      for (const intersect of intersects) {
         const { object, distance, point, face, normal, instanceId, c3_model } = intersect

         var c3_objects = this.raycastIntersectCurse(object, [])

         // instanced mesh
         if (instanceId != null && object.c3_model) {
            c3_objects.push(object.c3_model.instanceData.objectMap[instanceId])
         }

         // let c3_object = undefined
         for (var c3_object of c3_objects) {
            // only add if it hasn't been or is closer than current
            const alreadyAdded = returnIntersects[c3_object.id]  
            if (!alreadyAdded || alreadyAdded.distance > distance) {
               returnIntersects[c3_object.id] = {
                  object: c3_object,
                  distance: distance,
                  point: point,
                  normal: face && normal,
               }
            }
         }
      }
      
      return Object.values(returnIntersects).sort((a, b) => a.distance - b.distance)
   }

   raycastIntersectCurse(intersect, collection) {

      if (intersect.C3_Object) {
         collection.push(intersect.C3_Object)
      }

      if (intersect.parent) {
         this.raycastIntersectCurse(intersect.parent, collection)
      }

      return collection
   }
}
