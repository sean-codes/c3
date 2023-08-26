import { C3 } from '../../src/C3.js'
import { OutlinePass } from '../../libs/three/examples/jsm/postprocessing/OutlinePass.js'
const c3 = new C3()

window.OutlinePass = OutlinePass

class ObjectAnimated extends c3.Object {
   mesh() {
      var model = c3.models.find('player').clone()
      model.animateWeight('Arms.Walk', 1)
      model.animateWeight('Legs.Walk', 1)
      // var swordModel = c3.models.find('sword').clone()
      // this.swordModel = swordModel
      // model.boneAdd('Weapon', swordModel)
      // model.object.traverse(c => {
      //    console.log(c)
      //    if (c.type == 'Bone') c.visible = false
      // })

      // const geo = new c3.THREE.BoxGeometry(3, 4.5, 3)
      // const mat = c3.models.materialFind('WIREFRAME')
      // const mes = new c3.THREE.Mesh(geo, mat)
      
      const container = new c3.THREE.Object3D()
      // container.add(mes)
      container.add(model.object)


      return container
   }
   
   create() {
      this.setPosition(-5, 0, 0)
   }
   
   step() {
      this.rotateX(0.01)
      this.rotateZ(0.01)
   }
}

class ObjectStatic extends c3.Object {
   mesh() {
      var model = c3.models.find('rock').clone()
      console.log(model)
      return model.object
   }
   
   create() {
      this.setPosition(5, 0, 0)
   }
   
   step() {
      this.rotateX(0.01)
      this.rotateZ(0.01)
   }
}

class ObjectLight extends c3.Object {
   mesh() {
      return c3.light.Directional()
   }
   
   create() {
      this.setPosition(0, 5, 5)
   }
}

c3.init({
   types: {
      ObjectAnimated: ObjectAnimated,
      ObjectStatic: ObjectStatic,
      ObjectLight: ObjectLight,
   },

   

   models: [
      { 
         name: 'player', 
         file: './assets/cubeperson.fbx', 
         scale: 0.01,
         clips: [
            { name: 'Arms.Walk', map: 'Armature|Arms.Walk', add: 'Base' },
            { name: 'Legs.Walk', map: 'Armature|Legs.Walk', add: 'Base' },
         ],
         log: true
      },
      // { name: 'sword', file: '../../../c3-warrior/src/client/Assets/equipment/Sword.glb', scale: 1.25, rotation: [0, 0, 0], offset: [0, 0, 0] },
      { name: 'rock', file: './assets/rock.fbx', scale: 0.05, rotation: [0, 0, 0], offset: [0, 0, 0] },
   ],
   
   init: function() {
      window.c3 = c3
      // c3.camera.setNearFar(1,10000)
      console.log('c3', c3)
      
      c3.mesh.setMaterialType(c3.const.MaterialTypePhong)
      c3.scene.setBackground('#555')
      c3.camera.setPosition(0, 0, 30)
      
      c3.models.materialAdd('WIREFRAME', new c3.THREE.MeshBasicMaterial({
         color: '#465',
         wireframe: true,
         opacity: 1,
         transparent: false,
         visible: false,
      }))

      window.objectAnimated = c3.objects.create(c3.types.ObjectAnimated)
      window.objectStatic = c3.objects.create(c3.types.ObjectStatic)
      c3.objects.create(c3.types.ObjectLight)

      // add a render pass
      window.outlinePass = new OutlinePass(new c3.THREE.Vector2(window.innerWidth, window.innerHeight), c3.scene.object, c3.camera.object)
      outlinePass.depthMaterial.skinning = true
      outlinePass.prepareMaskMaterial.skinning = true
      c3.render.addPass(outlinePass)
      c3.render.compo
      c3.global.outlinePass = outlinePass

      outlinePass.selectedObjects = [ window.objectAnimated.mesh, window.objectStatic.mesh ]
   }
})
