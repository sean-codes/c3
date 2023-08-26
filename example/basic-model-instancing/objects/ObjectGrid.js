import { c3 } from '../c3.js'


export class ObjectGrid extends c3.Object {
   mesh() {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = 100
      canvas.height = 100
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.strokeRect(0, 0, canvas.width, canvas.height)

      const texture = new c3.THREE.CanvasTexture(canvas, undefined, c3.THREE.RepeatWrapping, c3.THREE.RepeatWrapping, c3.THREE.NearestFilter, c3.THREE.NearestFilter)
      texture.repeat.x = 200
      texture.repeat.y = 200
      const material = new c3.THREE.MeshBasicMaterial({ 
         map: texture, 
         transparent: true,
         side: c3.THREE.DoubleSide
      })
      this.material = material
      const geometry = new c3.THREE.PlaneGeometry( 1000, 1000 );
      const plane = new c3.THREE.Mesh( geometry, material );
      plane.rotation.x = -Math.PI*0.5
      return plane
   }
   create() {
      this.blockSelect = true
   }
   
   step() {
   }
   
}
