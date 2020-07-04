import * as THREE from '../node_modules/three/build/three.module.js'

export class C3_Render {
  constructor(c3) {
    this.c3 = c3
    
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    })

    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.domElement.tabIndex = 1

    document.body.appendChild(this.renderer.domElement);
  }

  loop(scene, camera, delta) {
    this.renderer.render(scene.object, camera.object)
  }

  handleResize(width, height) {
    this.renderer.domElement.width = width
    this.renderer.domElement.height = height
    
    this.renderer.setSize(width, height, false)
  }
}
