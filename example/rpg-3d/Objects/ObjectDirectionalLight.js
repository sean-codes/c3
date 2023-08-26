import { c3 } from '../c3.js'

export class ObjectDirectionalLight extends c3.Object {
   mesh() {
      const dirLight = new c3.THREE.DirectionalLight('#FFF', 0.5)
      dirLight.castShadow = true
      dirLight.position.set(60, 60, 0)
      dirLight.shadow.bias = -0.0005
      // dirLight.shadow.type = c3.THREE.PCFSoftShadowMap;
      dirLight.shadow.mapSize.width = 2048 
      dirLight.shadow.mapSize.height = 2048
      dirLight.shadow.camera.right = 120;
      dirLight.shadow.camera.left = -120;
      dirLight.shadow.camera.top = 80;
      dirLight.shadow.camera.bottom = -80;
      dirLight.shadow.camera.near = 0.5;
      dirLight.shadow.camera.far = 170;
      
      // const dirLightCameraHelper = new c3.THREE.CameraHelper(dirLight.shadow.camera)
      // dirLight.add(dirLightCameraHelper)
      
      return dirLight
   }
   
   create() {
      
   }
}
