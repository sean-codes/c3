import { CSS2DRenderer, CSS2DObject } from '../node_modules/three/examples/jsm/renderers/CSS2DRenderer.js'

export class C3_Html {
   constructor(c3) {
      this.c3 = c3
      const htmlC3HtmlContainer = document.createElement('div')
      htmlC3HtmlContainer.classList.add('C3_HTML_Container')
      htmlC3HtmlContainer.setAttribute('style', `
         position: fixed;
         top: 0px; 
         left: 0px;
         pointer-events: none;
      `)

      this.renderer = new CSS2DRenderer({
         element: htmlC3HtmlContainer
      })

      this.renderer.setSize(window.innerWidth, window.innerHeight)
      document.body.appendChild(htmlC3HtmlContainer)
   }
   
   create(html) {
      const htmlObject = new CSS2DObject(html)
      htmlObject.toggle = (bool) => {
         htmlObject.visible = typeof bool === 'undefined'
            ? !htmlObject.visible
            : bool

         if (htmlObject.dead) htmlObject.visible = false
      }

      return htmlObject
   }

   destroy(htmlObject) {
      htmlObject.dead = true
      htmlObject.element.remove()
      htmlObject.parent.remove(htmlObject)
      htmlObject.visible = false
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
      element.classList.add('C3_STYLE_' + key)
      document.head.appendChild(element)
   }
}
