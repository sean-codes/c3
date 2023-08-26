import * as THREE from '../libs/three/build/three.module.js'
import { EffectComposer } from '../libs/three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from '../libs/three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from '../libs/three/examples/jsm/postprocessing/OutlinePass.js'
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
    // var fxaaPass = new ShaderPass(FXAAShader)
    // var outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), c3.scene.object, c3.camera.object)
    // c3.global.outlinePass = outlinePass
    // this.addPass(fxaaPass, {
      //   resize: (pixelRatio, width, height) => {
        //     // if this is common move into handleResize
        //     console.log('resized', width, height)
        // const pixelRatio = window.devicePixelRatio
        // renderPass.setSize(window.innerWidth*pixelRatio, window.innerHeight*pixelRatio)
        //   fxaaPass.material.uniforms['resolution'].value.x = 1 / ( window.innerWidth * pixelRatio )
        // fxaaPass.material.uniforms['resolution'].value.y = 1 / ( window.innerHeight * pixelRatio )
    //   }
    // })
    this.composer.addPass(renderPass)
    // this.composer.addPass(fxaaPass)
    // this.addPass(renderPass)
    // this.addPass(outlinePass)
    // this.addPass(outlinePass)
  }
  
  addPass(pass, options) {
    this.passes.push({ pass, options })
    this.composer.addPass(pass)
    // this.handleResize()
  }

  loop(scene, camera, delta) {
    // this.renderer.render(this.c3.scene.object, this.c3.camera.object)
    this.composer.render()
  }

  handleResize(width, height) { 
    console.log('help', width, height)
    this.renderer.domElement.width = width
    this.renderer.domElement.height = height
    this.renderer.setSize(width, height)
    this.composer.setSize(width, height)
     
    
    // update render passes
    for (var { pass, options } of this.passes) {
      console.log('hi', pass)
      pass.setSize(width, height, false)
      options?.resize(window.devicePixelRatio, width, height)
    }
  }
}
