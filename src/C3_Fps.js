export class C3_Fps {
   constructor(c3) {
      this.c3 = c3
      this.frames = 0
      this.fps = 0
      this.time = Date.now()
      this.updated = false
   }
   
   step() {
      this.frames += 1
      this.updated = false
      
      const now = Date.now()
      if (now - this.time > 1000) {
         this.fps = this.frames
         this.frames = 0
         this.time = now
         this.updated = true
      }
   }
   
   get() {
      return this.fps
   }
}
