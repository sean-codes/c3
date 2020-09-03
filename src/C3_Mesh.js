import * as THREE from '../node_modules/three/build/three.module.js'
import * as CONSTANTS from './constants.js'

export class C3_Mesh {
   constructor(c3) {
      this.c3 = c3
      this.materialType = CONSTANTS.MaterialTypeBasic
   }
   
   setMaterialType(materialType) {
      this.materialType = materialType
   }
   
   Box({
      size = [1, 1, 1],
      color = '#FFF'
   }) {
      let MaterialConstructor = THREE.MeshBasicMaterial
      
      if (this.materialType == CONSTANTS.MaterialTypePhong) {
         MaterialConstructor = THREE.MeshPhongMaterial
      }
      const geo = new THREE.BoxBufferGeometry(...size)
      const mat = new MaterialConstructor({ color })
      return new THREE.Mesh(geo, mat)
   }
   
   Blank(options) {
      return new THREE.Object3D()
   }
}
