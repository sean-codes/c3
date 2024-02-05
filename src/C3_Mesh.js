import * as THREE from '../libs/three/build/three.module.js'
import * as CONSTANTS from './constants.js'

export class C3_Mesh {
   constructor(c3) {
      this.c3 = c3
      this.materialType = CONSTANTS.MaterialTypeToon
      this.materialConstructor = THREE.MeshToonMaterial
      this.constructors = {}
      this.constructors[CONSTANTS.MaterialTypeBasic] = THREE.MeshBasicMaterial
      this.constructors[CONSTANTS.MaterialTypePhong] = THREE.MeshPhongMaterial
      this.constructors[CONSTANTS.MaterialTypeToon] = THREE.MeshToonMaterial
   }
   
   setMaterialType(materialType) {
      this.materialType = materialType
      this.materialConstructor = this.constructors[materialType]
   }
   
   createMaterial(color) {
      return new this.materialConstructor({ color })
   }

   Box({
      size = [1, 1, 1],
      color = '#FFF'
   }) {
      const geo = new THREE.BoxBufferGeometry(...size)
      const mat = this.createMaterial(color)
      return new THREE.Mesh(geo, mat)
   }

   Sphere({
      size = 1,
      color = '#FFF'
   }) {
      const geo = new THREE.SphereGeometry(size)
      const mat = this.createMaterial(color)
      return new THREE.Mesh(geo, mat)
   }

   Cylinder({
      size = [1, 1, 2, 16],
      color = '#FFF'
   }) {
      const geo = new THREE.CylinderGeometry(...size)
      const mat = this.createMaterial(color)
      return new THREE.Mesh(geo, mat)
   }
   
   Blank(options) {
      return new THREE.Object3D()
   }
}
