import { c3 } from '../c3.js'

export class ObjectGround extends c3.Object {
   mesh() {
      const geo = new c3.THREE.BoxBufferGeometry(200, 3, 200)
      const mat = new c3.THREE.MeshPhongMaterial({ 
         color: '#4b7', 
         // map: textureGrass, 
         flatShading: true, 
         reflectivity: 0, 
         shininess: 0 
      })
      const mes = new c3.THREE.Mesh(geo, mat)
      mes.receiveShadow = true
      // mes.rotation.x -= Math.PI * 0.5
      mes.position.y -= 0.001
      
      return mes
   }
   
   physics() {
      return {
         meshes: [{ mesh: this.mesh, type: 'BOX' }],
         material: 'GROUND',
         mass: 0,
         debug: true
      }
   }
   
   create() {
      this.setPosition(0, -1.5, 0)
   }
}
