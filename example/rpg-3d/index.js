import { c3 } from './c3.js'
import { ObjectAmbientLight } from './Objects/ObjectAmbientLight.js'
import { ObjectArrow } from './Objects/ObjectArrow.js'
import { ObjectBox } from './Objects/ObjectBox.js'
import { ObjectCamera } from './Objects/ObjectCamera.js'
import { ObjectDirectionalLight } from './Objects/ObjectDirectionalLight.js'
import { ObjectDragon } from './Objects/ObjectDragon.js'
import { ObjectGround } from './Objects/ObjectGround.js'
import { ObjectPlatform } from './Objects/ObjectPlatform.js'
import { ObjectPlayer } from './Objects/ObjectPlayer.js'
import { ObjectResource } from './Objects/ObjectResource.js'
import { ObjectTarget } from './Objects/ObjectTarget.js'
import { ObjectWeapon } from './Objects/ObjectWeapon.js'
import { ObjectCylinder } from './Objects/ObjectCylinder.js'

c3.init({
   node_modules: '../../node_modules',
   path: '../C3',
   keyMap: {
      forward: 87,
      left: 65,
      right: 68,
      backward: 83,
      attack: 69,
      equip_helmet: 49,
      jump: 32, 
      block: 81, // q
      target: 84, // t
      sheath: 88, // x
      sprint: 16, // shift
   },

   types: {
      AmbientLight: ObjectAmbientLight,
      Arrow: ObjectArrow,
      Box: ObjectBox,
      Camera: ObjectCamera,
      DirectionalLight: ObjectDirectionalLight,
      Dragon: ObjectDragon,
      Ground: ObjectGround,
      Platform: ObjectPlatform,
      Player: ObjectPlayer,
      Resource: ObjectResource,
      Target: ObjectTarget,
      Weapon: ObjectWeapon,
      Cylinder: ObjectCylinder,
   },

   models: [
      { name: 'sword', file: './Assets/equipment/Sword.fbx', scale: 0.0125, rotation: [0, Math.PI*0.5, 0], offset: [0, -0.4, 0.15] },
      { name: 'shield', file: './Assets/equipment/Shield.fbx', scale: 0.013, rotation: [0, -Math.PI*0.5, 0], offset: [0, 0, 0] },
      { name: 'tree', file: './Assets/environment/Tree.fbx', scale: 0.035, },
      { name: 'rock', file: './Assets/environment/Rock.fbx', scale: 0.035, },
      { name: 'bush', file: './Assets/environment/Bush.fbx', scale: 0.035, },
      { name: 'fence', file: './Assets/environment/Fence.fbx', scale: 0.035, },
      { name: 'dragon', file: './Assets/Dragon.fbx', scale: 0.01, offset: [0, 0.2, 0.15] },
      { log: true, name: 'arrow', file: './Assets/equipment/Arrow.fbx', scale: 0.015, rotation: [-Math.PI*0.5, 0, 0], offset: [0, 0, 0] },
      { 
         name: 'bow', 
         file: './Assets/equipment/Bow.fbx', 
         scale: 0.01, 
         rotation: [0, -Math.PI*0.5, 0], 
         offset: [0, 0, 0],
         clips: [
            { name: 'Hold', map: 'Armature|Hold', add: true, pose: true }
         ]  
      },
      {
         name: 'character', 
         scale: 0.01,
         file: './Assets/CubePerson.fbx',
         clips: [
            { name: 'Idle', map: 'Armature|Idle', add: true },
            { name: 'Legs.Walk', map: 'Armature|Legs.Walk', add: true },
            { name: 'Legs.Walk_Strafe', map: 'Armature|Legs.Walk_Strafe', add: true },
            { name: 'Arms.Walk', map: 'Armature|Arms.Walk', add: true },
            { name: 'Arms.Attack', map: 'Armature|Arms.Attack', add: true },
            { name: 'Arms.Block', map: 'Armature|Arms.Block', add: true, pose: true },
            { name: 'Arms.Bow', map: 'Armature|Arms.Bow', add: true, pose: true },
            { name: 'Arms.EquipWeapon', map: 'Armature|Arms.EquipWeapon', add: true },
            { name: 'Arms.EquipWeaponEnd', map: 'Armature|Arms.EquipWeaponEnd', add: true, stringed: true },
            { name: 'Arms.EquipShield', map: 'Armature|Arms.EquipShield', add: true },
            { name: 'Arms.EquipShieldEnd', map: 'Armature|Arms.EquipShieldEnd', add: true, stringed: true },
            { name: 'Legs.Jump', map: 'Armature|Legs.Jump', add: true, pose: true },
            { name: 'Arms.Jump', map: 'Armature|Arms.Jump', add: true, pose: true },
         ]
      },
   ],
   
   progress: function(percent) {
      const eleLoadScreen = document.querySelector('.load-screen')
      const eleLoaderInner = document.querySelector('.loader .inner')
      eleLoaderInner.style.width = `${percent * 100}%`
      if (percent === 1) eleLoadScreen.style.display = 'none'
   },

   init: function() {
      c3.scene.setBackground('#FFF')      
      c3.camera.setNearFar(1, 75)
      c3.scene.setFog(45, 75)

      c3.models.materialAdd('BOX', new c3.THREE.MeshLambertMaterial({ color: '#F55' }))
      c3.models.materialAdd('TARGET', new c3.THREE.MeshLambertMaterial({ color: '#99f' }))
      c3.models.materialAdd('WIREFRAME', new c3.THREE.MeshBasicMaterial({
         color: '#000',
         wireframe: true,
         opacity: 0.1,
         transparent: true,
         // visible: false,
      }))

      // Setup materials
      c3.physics.addMaterial('BOX', { friction: 0.1, restitution: 0  })
      c3.physics.addMaterial('PLAYER', { friction: 0, restitution: 0 })
      c3.physics.addMaterial('GROUND', { friction: 0.1, restitution: 0 })

      // lights
      c3.objects.create(c3.types.AmbientLight)
      c3.objects.create(c3.types.DirectionalLight)

      const player = c3.objects.create(c3.types.Player, { pos: new c3.Vector(0, 5, 0) })
      c3.objects.create(c3.types.Ground)

      for (let i = 0; i < 40; i++) {
         c3.objects.create(c3.types.Box)
      }

      for (let i = 0; i < 100; i++) {
         c3.objects.create(c3.types.Resource)
      }

      for (let x = 0; x < 2; x++) {
         for (let y = 0; y < 2; y++) {
            c3.objects.create(c3.types.Dragon, { pos: new c3.Vector(15+x*6, 2, -15+y*6) })
         }
      }
      
      c3.objects.create(c3.types.Cylinder, { pos: new c3.Vector(0, 10, 10)})

      c3.objects.create(c3.types.Platform, { pos: new c3.Vector(-15, 3, -15) })
      c3.objects.create(c3.types.Platform, { pos: new c3.Vector(-20, 6, -15) })
      c3.objects.create(c3.types.Target, { pos: new c3.Vector(-8, 4, 8) })
   },

   step: function(c3) {
      // this.scripts.cameraController.step()
   }
})
