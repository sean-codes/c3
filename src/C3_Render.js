import * as THREE from '../libs/three/build/three.module.js'
import { EffectComposer } from '../libs/three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from '../libs/three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from '../libs/three/examples/jsm/postprocessing/ShaderPass.js'
import { FXAAShader } from '../libs/three/examples/jsm/shaders/FXAAShader.js'

export class C3_Render {
  constructor(c3) {
    this.c3 = c3
    
    this.renderer = new THREE.WebGLRenderer({
      // logarithmicDepthBuffer: true
    })

    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // this.renderer.shadowMap.type = THREE.BasicShadowMap
    this.renderer.domElement.tabIndex = 1

    document.body.appendChild(this.renderer.domElement)

    this.passes = []

    this.composer = new EffectComposer(this.renderer)
    
    var renderPass = new RenderPass(c3.scene.object, c3.camera.object)
    var fxaaPass = new ShaderPass(FXAAShader)

    this.addPass(renderPass, 0)
    this.addPass(fxaaPass, 100, {
        resize: (pixelRatio, width, height) => {
          // if this is common move into handleResize
          // renderPass.setSize(window.innerWidth*pixelRatio, window.innerHeight*pixelRatio)
          fxaaPass.material.uniforms['resolution'].value.x = 1 / ( width * pixelRatio )
          fxaaPass.material.uniforms['resolution'].value.y = 1 / ( height * pixelRatio )
      }
    })
  }
  
  addPass(pass, sort = 1, options) {
    this.passes.push({ pass, sort, options })

    // reset passes
    for (let pass of this.composer.passes) {
      this.composer.removePass(pass)
    }

    // add them back
    var sorted = this.passes.sort((a, b) => a.sort < b.sort ? -1 : 1)
    for (let uPass of sorted) {
      this.composer.addPass(uPass.pass)      
    }

    this.handleResize(window.innerWidth, window.innerHeight)
  }

  loop(scene, camera, delta) {
    // this.renderer.render(this.c3.scene.object, this.c3.camera.object)
    this.composer.render()
  }

  handleResize(width, height) { 
    this.renderer.domElement.width = width
    this.renderer.domElement.height = height
    this.renderer.setSize(width, height)
    this.composer.setSize(width, height)
     
    
    // update render passes
    for (var { pass, options } of this.passes) {
      pass.setSize(width, height)
      options?.resize(window.devicePixelRatio, width, height)
    }
  }
}
