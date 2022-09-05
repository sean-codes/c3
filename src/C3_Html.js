import { CSS2DRenderer, CSS2DObject } from '../node_modules/three/examples/jsm/renderers/CSS2DRenderer.js'

export class C3_Html {
   constructor(c3) {
      this.c3 = c3
      this.renderer = new CSS2DRenderer()
      this.renderer.setSize( window.innerWidth, window.innerHeight )
      this.renderer.domElement.style.position = 'absolute'
      this.renderer.domElement.style.top = '0px'
      document.body.appendChild(this.renderer.domElement)
   }
   
   create(html) {
      const htmlObject = new CSS2DObject(html)
      return htmlObject
   }

   loop(scene, camera) {
      this.renderer.render(scene.object, camera.object)
   }
   
   handleResize(width, height) {
      this.renderer.setSize(width, height)
   }
   
   addStyle(key, style) {
      const isAlreadyAStylesheet = document.querySelector('.C3_STYLE_' + key)
      const element = isAlreadyAStylesheet ? isAlreadyAStylesheet : document.createElement('style')
      
      element.innerHTML = style
      element.class = 'C3_STYLE_' + key
      document.head.appendChild(element)
   }
}
