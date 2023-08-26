import { C3 } from '../../src/C3.js'
const c3 = new C3()

class ObjectLight extends c3.Object {
   mesh() {
      return c3.light.Directional()
   }
   
   create() {
      this.setPosition(0, 5, 5)
   }
}

class ObjectText extends c3.Object {
   mesh() {
      // see styles in index.html
      const div = document.createElement('div')
      div.innerHTML = 'example text'
      div.classList.add('text')
      const text = c3.html.create(div)
      this.text = text
      
      return text
   }
   
   create() {
      this.destroyTimer = 60
      const posX = Math.random() * 10 - 5
      this.setPosition(posX, 0, 0)

      console.log(this.text)
   }
   
   step() { 
      this.moveVec({ x: 0, y: 0.002, z: 0 })
      
      if (!this.destroyTimer--) {
         this.destroy()
      }
   }
}


c3.init({
   types: {
      Light: ObjectLight,
      Text: ObjectText,
   },
   
   init: function() {
      c3.mesh.setMaterialType(c3.const.MaterialTypePhong)
      c3.scene.setBackground('#555')
      c3.camera.setPosition(0, 0, 2)
      
      c3.objects.create(c3.types.Light)
   },
   
   step: function() {
      if (Math.random() > 0.9) {
         console.log('hello')
         c3.objects.create(c3.types.Text)
      }
   }
})


window.c3 = c3
