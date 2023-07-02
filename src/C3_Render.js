import * as THREE from '../node_modules/three/build/three.module.js'
import { EffectComposer } from '../node_modules/three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from '../node_modules/three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from '../node_modules/three/examples/jsm/postprocessing/OutlinePass.js'
import { ShaderPass } from '../node_modules/three/examples/jsm/postprocessing/ShaderPass.js'
import { FXAAShader } from '../node_modules/three/examples/jsm/shaders/FXAAShader.js'

export class C3_Render {
  constructor(c3) {
    this.c3 = c3
    
    this.renderer = new THREE.WebGLRenderer()

    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.domElement.tabIndex = 1

    document.body.appendChild(this.renderer.domElement)

    this.passes = []

    this.composer = new EffectComposer(this.renderer)
    
    var renderPass = new RenderPass(c3.scene.object, c3.camera.object)
    var fxaaPass = new ShaderPass(FXAAShader)
    // var outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), c3.scene.object, c3.camera.object)

    this.addPass(renderPass)
    this.addPass(fxaaPass, {
      resize: (pixelRatio, width, height) => {
        // if this is common move into handleResize
        fxaaPass.material.uniforms['resolution'].value.x = 1 / ( width * pixelRatio )
        fxaaPass.material.uniforms['resolution'].value.y = 1 / ( height * pixelRatio )
      }
    })
    // this.addPass(outlinePass)
  }
  
  addPass(pass, options) {
    this.passes.push({ pass, options })
    this.composer.addPass(pass)
  }

  loop(scene, camera, delta) {
    this.composer.render()
  }

  handleResize(width, height) { 
    this.renderer.domElement.width = width
    this.renderer.domElement.height = height
    this.renderer.setSize(width, height)
    this.composer.setSize(width, height)
     
    
    // update render passes
    for (var { pass, options } of this.passes) {
      pass.setSize(width, height, false)
      options?.resize(window.devicePixelRatio, width, height)
    }
  }
}
