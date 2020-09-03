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
      
      
      window.addEventListener('mousemove', (e) => this.handleMousemove(e))
      window.addEventListener('mousedown', (e) => this.handleMousedown(e))
      window.addEventListener('mouseup', (e) => this.handleMouseup(e))
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
      
      for (const event of this.events) {
         for (const eventName in event) {
            this[eventName] = event[eventName]
         }
      }
      
      this.events = []
      // console.log(c3.mouse.down, c3.mouse.up, c3.mouse.held)
   }
   
   raycast() {
      // TODO: cache this incase it's called more than once per step
      this.raycaster.setFromCamera(this.pos, this.c3.camera.object)
      const intersects = this.raycaster.intersectObjects(this.c3.scene.object.children, true)
      
      // match the intersects up with C3_Objects
      const returnIntersects = {}
      for (const intersect of intersects) {
         const { object, distance } = intersect
         let c3_object = undefined
         object.traverseAncestors((a) => {
            if (c3_object) return
            if (a.C3_Object) c3_object = { object: a.C3_Object, distance: distance }
         })
         
         
         if (c3_object) {
            returnIntersects[c3_object.object.id] = c3_object
         }
      }
      
      return Object.values(returnIntersects).sort((a, b) => a.distance - b.distance)
   }
}
