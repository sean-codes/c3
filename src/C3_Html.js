import { CSS2DRenderer, CSS2DObject } from '../libs/three/examples/jsm/renderers/CSS2DRenderer.js'

export class C3_Html {
   constructor(c3) {
      this.c3 = c3
      const htmlC3HtmlContainer = document.createElement('div')
      htmlC3HtmlContainer.classList.add('C3_HTML_Container')
      htmlC3HtmlContainer.setAttribute('style', `
         position: fixed;
         top: 0px; 
         left: 0px;
         width: 100%;
         height: 100%;
         pointer-events: none;
      `)

      this.renderer = new CSS2DRenderer({
         element: htmlC3HtmlContainer
      })

      this.renderer.setSize(window.innerWidth, window.innerHeight)
      document.body.appendChild(htmlC3HtmlContainer)
   }
   
   create(html) {
      var div = html
      if (typeof div === 'string') {
         div = document.createElement('div')
         div.innerHTML = html
      }

      const htmlObject = new CSS2DObject(div)
      htmlObject.toggle = (bool) => {
         htmlObject.visible = typeof bool === 'undefined'
            ? !htmlObject.visible
            : bool

         if (htmlObject.dead) htmlObject.visible = false
      }

      htmlObject.setHTML = (html) => {
         htmlObject.element.innerHTML = html
      }

      return htmlObject
   }

   destroy(htmlObject) {
      htmlObject.dead = true
      htmlObject.element.remove()
      htmlObject.visible = false
      // we should remove from parent but this causes an error
      // going to remove it for the moment since usually we only
      // destroy an htmlObject when we are destroying the parent
      // htmlObject.parent.remove(htmlObject)
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
