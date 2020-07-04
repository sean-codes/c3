import { c3 } from '../c3.js'

export class ObjectGround extends c3.Object {
   mesh() {
      const geo = new c3.three.PlaneBufferGeometry(200, 200)
      const mat = new c3.three.MeshPhongMaterial({ 
         color: '#4b7', 
         // map: textureGrass, 
         flatShading: true, 
         reflectivity: 0, 
         shininess: 0 
      })
      const mes = new c3.three.Mesh(geo, mat)
      mes.receiveShadow = true
      mes.rotation.x -= Math.PI * 0.5
      mes.position.y -= 0.001
      
      return mes
   }
   
   physics() {
      return {
         meshes: [this.mesh],
         material: 'GROUND',
         mass: 0
      }
   }
   
   create() {
      
   }
}
