import * as THREE from '../node_modules/three/build/three.module.js'

export class C3_Render {
  constructor(c3) {
    this.c3 = c3
    
    this.renderer = new THREE.WebGLRenderer({
      // antialias: true
    })

    // this.renderer.shadowMap.enabled = true
    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // this.renderer.domElement.tabIndex = 1

    document.body.appendChild(this.renderer.domElement);
  }

  loop(scene, camera, delta) {
    // console.log('meow')
    // window.requestAnimationFrame((time) => this.render(time))
    this.renderer.render(scene.object, camera.object)

    // c3.physics.loopApplyCollisions()

    // for (const object of this.objects.list) {
    //   object.step()
    // }
    // 
    // c3.physics.loop(delta)
    // c3.models.loop(delta)
    // c3.keyboard.resetKeys()
  }

  handleResize(width, height) {
    this.renderer.domElement.width = width
    this.renderer.domElement.height = height
    
    this.renderer.setSize(width, height, false)
  }
}
