import { c3 } from '../c3.js'

export class ObjectPlayer extends c3.Object {
   mesh() {
      // Bodies for physics
      const geoBodyBottom = new c3.THREE.SphereGeometry(0.9)
      const matBodyBottom = c3.models.materialFind('WIREFRAME')
      this.meshBodyBottom = new c3.THREE.Mesh(geoBodyBottom, matBodyBottom)
      
      const geoBodyTop = new c3.THREE.CylinderGeometry( 1, 1, 5, 10 )
      const matBodyTop = c3.models.materialFind('WIREFRAME')
      this.meshBodyTop = new c3.THREE.Mesh(geoBodyTop, matBodyTop)
      this.meshBodyTop.position.y += 2
      this.meshBodyBottom.add(this.meshBodyTop)
      
      const targetGeo = new c3.THREE.SphereGeometry()
      const targetMat = new c3.THREE.MeshBasicMaterial({ color: '#FFF', depthTest: false, flatShading: true})
      const targetMes = new c3.THREE.Mesh(targetGeo, targetMat)
      targetMes.renderOrder = 1000
      this.meshTarget = targetMes
      
      // Character Model
      this.model = c3.models.find('character')
      this.meshBodyBottom.add(this.model.object)
      this.model.object.position.y -= 1
      this.model.animateStart('Idle')
      
      const modelSword = c3.models.find('sword')
      const modelShield = c3.models.find('shield')
      const modelBow = c3.models.find('bow')
      const modelArrow = c3.models.find('arrow')
      this.modelArrow = modelArrow
      this.modelSword = modelSword
      this.modelShield = modelShield
      this.modelBow = modelBow
      
      return this.meshBodyBottom
   }
   
   physics() {
      return {
         meshes: [
            { mesh: this.meshBodyBottom }, 
            { mesh: this.meshBodyTop }
         ],
         material: 'PLAYER',
         fixedRotation: true,
         watchCollisions: true,
         checkIsOnGround: true,
         debug: true
      }
   }
   
   create({ pos, camera }) {
      this.setPositionVec(pos)
      
      // Camera
      this.camera = c3.objects.create(c3.types.Camera, { player: this } )
      
      // Weapon Collider
      this.weapon = c3.objects.create(c3.types.Weapon, { parent: this } )
      
      // Others
      this.accel = 4
      this.friction = 0.8
      this.speed = 20
      this.currentSpeed = new c3.Vector(0, 0)
      this.spinSpeed = 10
      this.isOnGround = false
      this.targetMoveAngle = 0
      this.targetLookAngle = 0
      this.target = undefined
      this.isWeaponEquipped = true
      this.isShieldEquipped = true
      
      // animation
      this.isBlocking = false
      this.isRunning = false
      this.isSprinting = false
      this.isSheathing = false
      this.isStrafingRight = false
      this.isStrafing = false
      this.isMovingForward = false
      this.isMovingBackward = false
      this.isBowHold = false
      
      
      // gear
      this.gear = {
         current: 0,
         type: 'bow',
         sets: [
            { mainHand: this.modelSword, offHand: this.modelShield, type: '1hand' },
            { mainHand: this.modelBow, offHand: this.modelArrow, type: 'bow' }
         ]
      }
      
      this.setGear(1)
   }
   
   step() {
      this.stepTargeting()
      this.stepAttack()
      this.stepMovement()
      this.stepJump()
      this.stepAnimation()
   
      // testing equip
      // if (c3.keyboard.check('equip_helmet').down) {
      //    const modelHelmet = c3.models.find('helmet')
      //    this.model.boneToggle('Head', modelHelmet)
      // }
   }
   
   stepTargeting() {
      if (c3.keyboard.check('target').down) {
         if (this.target) {
            this.target = undefined
         } else {
            const dragons = c3.objects.findAll(['Dragon', 'Target'])
            let closestDragon = undefined
            let closestDistance = 100000000000
            for (const dragon of dragons) {
               if (dragon.dead) continue
               
               const distanceFromPlayer = this.mesh.position.distanceTo(dragon.mesh.position)
   
               if (distanceFromPlayer < 20 && distanceFromPlayer < closestDistance) {
                  closestDragon = dragon
                  closestDistance = distanceFromPlayer               
               }
            }

            if (closestDragon) {
               this.target = closestDragon
            }
         }
      }
      
      
      if (this.target) {
         !this.meshTarget.parent && c3.scene.add(this.meshTarget)
         this.meshTarget.position.copy(this.target.mesh.position)
         const distanceFromCamera = c3.camera.distanceFrom(this.meshTarget)
         const targetScale = distanceFromCamera/100
         this.meshTarget.scale.set(targetScale, targetScale, targetScale)
      } else {
         c3.scene.remove(this.meshTarget)
      }
   }
   
   stepMovement() {
      // Movement
      let speed = this.speed
      this.isSprinting = c3.keyboard.check('sprint').held
      this.isStrafing = false
      this.isMovingForward = false
      this.isMovingBackward = false
      
      if (this.isSprinting && !this.isBlocking) {
         speed *= 1.25
      } else {
         if (this.isBlocking || this.isAttacking || this.isBowHold) {
            speed *= 0.5
         }
      }
      
      
      let targetMoveAngle = null
      let targetLookAngle = null
      let baseAngle = this.camera.yRot.rotation.y
      
      if (this.target && !this.target.dead) {
         const direction = this.target.mesh.position.clone().sub(this.mesh.position)
         const angleToTarget = new c3.THREE.Vector2(-direction.x, direction.z).angle() - (Math.PI/2)
         
         baseAngle = this.isSprinting ? baseAngle : angleToTarget
         targetLookAngle = angleToTarget
         
         !this.isSprinting && this.camera.pointTowards(targetLookAngle)
      } else {
         this.target = undefined
      }
      
      
      if (c3.keyboard.check('forward').held) {
         targetMoveAngle = c3.math.loopAngle(baseAngle)
         this.isMovingForward = true
      }
      
      if (c3.keyboard.check('backward').held) {
         targetMoveAngle = c3.math.loopAngle(baseAngle + Math.PI)
         this.isMovingBackward = true
      }
      
      
      if (c3.keyboard.check('left').held) {
         let pull = 2
         
         if (this.target && !this.isSprinting) {
            this.isStrafing = true
            const distanceFromTarget = this.target.mesh.position.distanceTo(this.mesh.position)
            const distanceAdjust = Math.min(distanceFromTarget, 20)
            const maxAdjust = 0.6 // this probably depends on speed
            const adjust = maxAdjust * ((20 - distanceAdjust) / 20)
            pull = 2 + adjust
         }
         
         const keyAngle = c3.math.loopAngle(baseAngle + Math.PI/pull)
         targetMoveAngle = targetMoveAngle !== null
             ? targetMoveAngle + c3.math.angleToAngle(targetMoveAngle, keyAngle) / 2
             : keyAngle
      }
      
      if (c3.keyboard.check('right').held) {
         let pull = 2
         
         if (this.target && !this.isSprinting) {
            this.isStrafing = true
            const distanceFromTarget = this.target.mesh.position.distanceTo(this.mesh.position)
            const distanceAdjust = Math.min(distanceFromTarget, 20)
            const maxAdjust = 0.6 // this probably depends on speed
            const adjust = maxAdjust * ((20 - distanceAdjust) / 20)
            pull = 2 + adjust
         }
         
         // cmon sean why the fuck cant you figure this out
         const keyAngle = c3.math.loopAngle(baseAngle - Math.PI/pull)
         targetMoveAngle = targetMoveAngle !== null
             ? targetMoveAngle + c3.math.angleToAngle(targetMoveAngle, keyAngle) / 2
             : keyAngle
      }
      
      if (!this.target || this.isSprinting) {
         targetLookAngle = targetMoveAngle
      }
      
      if (c3.keyboard.check('forward').held
         || c3.keyboard.check('backward').held
         || c3.keyboard.check('left').held
         || c3.keyboard.check('right').held
      ) {
         this.currentSpeed.add(new c3.Vector(0, this.accel).rotateAround(new c3.Vector(), -targetMoveAngle))
      } else {
         this.currentSpeed.multiplyScalar(this.friction)
      }
      

      if (targetMoveAngle !== null) this.targetMoveAngle = targetMoveAngle
      if (targetLookAngle !== null) this.targetLookAngle = targetLookAngle
      this.addRotationY(c3.math.angleToAngle(this.rotation.y, this.targetLookAngle)/5)

      // Run / Idle Animation
      this.isRunning = false
      if (
         c3.keyboard.check(['forward', 'backward', 'left', 'right']).held
      ) {
         this.isRunning = true
      }
      
      // clamp speed
      const speedDirection = this.currentSpeed.clone().normalize()
      const speedLength = this.currentSpeed.distanceTo(new c3.Vector())
      if (speedLength > speed) this.currentSpeed = speedDirection.multiplyScalar(speed)
      
      this.body.velocity.set(
         this.currentSpeed.x,
         this.body.velocity.y,
         this.currentSpeed.y,
      )
   }
   
   stepAttack() {
      // Attack
      this.isBowHold = false
      
      if (c3.keyboard.check('attack').down && !this.isAttacking) {
         if (this.gear.type == '1hand') {
            this.isAttacking = true
            // yikes this is dependent on an animation speed
            this.model.animateOnce('Arms.Attack', 1, () => { this.isAttacking = false })
         }
      }
      
      if (c3.keyboard.check('attack').held) {
         if (this.gear.type === 'bow') {
            this.isBowHold = true
         }
      }
      
      if (c3.keyboard.check('attack').up) {
         if (this.gear.type === 'bow' && this.model.animateGetWeight('Arms.Bow') > 0.99) {
            c3.objects.create(c3.types.Arrow, { pos: this.modelArrow.object.getWorldPosition(), rotation: this.getRotation() })
         }
      }
      
      if (c3.keyboard.check('block').down) {
         this.isBlocking = true
      }
      
      if (c3.keyboard.check('block').up) {
         this.isBlocking = false
      }
      
      if (c3.keyboard.check('sheath').down) {
         this.isSheathing = true
         
         this.model.animateOnce('Arms.EquipWeapon', 0.25, () => { 
            this.swapGear()
            this.model.animateOnce('Arms.EquipWeaponEnd', 0.25, () => {
               this.isSheathing = false
            })
         })
         

         this.model.animateOnce('Arms.EquipShield', 0.25, () => { 
            this.model.animateOnce('Arms.EquipShieldEnd', 0.25, () => {
               this.isSheathing = false
            })
         })
      }
   }
   
   stepJump() {
      this.isOnGround = this.getIsOnGround()
      
      // Jump
      if (this.body.velocity.y > 5) this.isOnGround = false
      if (c3.keyboard.check('jump').down && this.isOnGround) {
         this.body.velocity.y = 25
      }
   }
   
   stepAnimation() {
      // Before we get started. Does anyone want to get out?
      // I'm wondering what if I never turn the animations off.
      // We can figure out a way to manage the weights and let them fade in/out automatically
      let idleWeight = 1
      if (this.isBowHold) idleWeight = 0.1
      this.model.animateWeight('Idle', idleWeight)
      this.model.animateWeight('Arms.Walk', 0)
      this.model.animateWeight('Legs.Walk', 0)
      this.model.animateWeight('Legs.Walk_Strafe', 0)
      
      if (this.isRunning) {
         let runWeightArms = 1
         let runWeightLegs = 1
         let runWeightStrafing = 0
         if (this.isBlocking) { runWeightArms = 0.2; runWeightLegs = 0.2 }
         if (this.isAttacking) { runWeightArms = 0.2 }
         if (!this.isOnGround) { runWeightLegs = 0.1; runWeightArms = 0.1 }
         if (this.isStrafing) {
            runWeightArms = 0.2;
            runWeightLegs = this.isMovingForward || this.isMovingBackward ? 0.5 : 0; 
            runWeightStrafing = 1 
         }
         if (this.isBowHold) { runWeightArms = 0.0 }
         
         this.model.animateWeight('Arms.Walk', runWeightArms)
         this.model.animateWeight('Legs.Walk', runWeightLegs)
         this.model.animateWeight('Legs.Walk_Strafe', runWeightStrafing)
   
         let runScale = 1
         if (this.isSprinting) { runScale = 1.5 }
         if (this.isBlocking) { runScale = 0.5 }
         if (this.isAttacking) { runScale = 0.5 }
         if (this.isBowHold) { runScale = 0.5 }
         
         this.model.animateScale('Arms.Walk', runScale)
         this.model.animateScale('Legs.Walk', runScale)
      }
      
      this.model.animateWeight('Arms.Block', 0)
      if (this.isBlocking) {
         this.model.animateWeight('Arms.Block', 1)
      }
      
      this.model.animateWeight('Arms.Attack', 0)
      if (this.isAttacking) {
         this.model.animateWeight('Arms.Attack', 1)
      }
      
      if (this.gear.type === 'bow') {
         this.model.animateWeight('Arms.Bow', 0)
         this.modelBow.animateWeight('Hold', 0)
         if (this.isBowHold) {
            this.model.animateWeight('Arms.Bow', 1)
            this.modelBow.animateWeight('Hold', 1)
         }
      }
      
      this.model.animateWeight('Legs.Jump', 0)
      this.model.animateWeight('Arms.Jump', 0)
      if (!this.isOnGround && !this.isAttacking) {
         let jumpWeightArms = 1
         
         if (this.isBowHold) jumpWeightArms = 0
         this.model.animateWeight('Legs.Jump', 1)
         this.model.animateWeight('Arms.Jump', jumpWeightArms)
      }
   }
   
   swapGear() {
      let nextSetId = this.gear.current + 1
      if (nextSetId >= this.gear.sets.length) nextSetId = 0
      this.setGear(nextSetId) 
   }
   
   setGear(setId) {
      const currSet = this.gear.sets[this.gear.current]
      const nextSet = this.gear.sets[setId]
      
      this.model.boneClear('Arrow')
      this.model.boneClear('Weapon')
      this.model.boneClear('Shield')
      
      this.model.boneAdd('Weapon', nextSet.mainHand)
      
      if (nextSet.type === 'bow') {
         this.model.boneAdd('Arrow', nextSet.offHand)
      } else {
         this.model.boneAdd('Shield', nextSet.offHand)
         this.model.boneAdd('Weapon', this.weapon.origin)
      }
      
      if (currSet.type === 'bow') {
         this.model.boneAdd('Weapon_Back_Bow', currSet.mainHand)
      } else {
         this.model.boneAdd('Weapon_Back', currSet.mainHand)
         this.model.boneAdd('Shield_Back', currSet.offHand)
      }
      
      this.gear.current = setId
      this.gear.type = nextSet.type
   }
}
