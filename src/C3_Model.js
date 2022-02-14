import * as THREE from '../node_modules/three/build/three.module.js'
import { SkeletonUtils } from '../node_modules/three/examples/jsm/utils/SkeletonUtils.js'

export class C3_Model {
   constructor({ c3, loadInfo, object, isClone = false, id }) {
      this.c3 = c3
      this.id = id
      this.destroyed = false
      this.loadInfo = loadInfo
      this.name = loadInfo.rename || loadInfo.name
      // makes it easier to scale rotate etc without breaking animations
      this.object = new THREE.Object3D()
      this.object.add(object)
      this.bones = {}
      this.currentClip = undefined
      this.endFuncs = []

      object.traverse((part) => {
         // flat shading
         if (part.material) {
            const modifyMaterial = (material) => {
               material.flatShading = true
               material.reflectivity = 0
               material.shininess = 0
               
               if (loadInfo.materialOverrides) {
                  const overrides = loadInfo.materialOverrides[material.name]
                  if (overrides) {
                     if (overrides.opacity) {
                        material.opacity = overrides.opacity
                        material.transparent = true
                        material.side = c3.THREE.DoubleSide
                     }
                     
                     if (overrides.doubleSide) {
                        material.side = c3.THREE.DoubleSide
                     }
                  }
               }
            }

            if (part.material.length) part.material.forEach(modifyMaterial)
            else modifyMaterial(part.material)
         }

         // bones
         if (part.type === 'Bone') {
            this.bones[part.name] = part
         }

         if (part.type === 'Mesh' || part.type === 'SkinnedMesh') {
            if (part.name.startsWith('c3_phy_mesh')) part.visible = false
            if (part.name.startsWith('hidden_')) part.visible = false
            if (!loadInfo.noReceiveShadow) part.receiveShadow = true
            if (!loadInfo.noCastShadow) part.castShadow = true
            if (loadInfo.meshOverrides) {
               const overrides = loadInfo.meshOverrides[part.name]
               if (overrides) {
                  if (overrides.noShadow) {
                     part.receiveShadow = false
                     part.castShadow = false
                  }
               }
            }
         }
      })
      
      if (loadInfo.noWorldOffset) {
         object.position.x = 0
         object.position.y = 0
         object.position.z = 0
      }
      
      if (!isClone && loadInfo.rotation) {
         object.rotateX(loadInfo.rotation[0])
         object.rotateY(loadInfo.rotation[1])
         object.rotateZ(loadInfo.rotation[2])
      }

      if (loadInfo.offset) {
         object.translateX(loadInfo.offset[0] / loadInfo.scale)
         object.translateY(loadInfo.offset[1] / loadInfo.scale)
         object.translateZ(loadInfo.offset[2] / loadInfo.scale)
      }
      
      // scale
      // scale after so we can adjust axis
      this.object.scale.x = loadInfo.scale
      this.object.scale.y = loadInfo.scale
      this.object.scale.z = loadInfo.scale

      //animations
      this.mixer = new THREE.AnimationMixer(object)
      this.clips = {}

      // we order by defined clips to handle multi level additive animations
      // for some reason if some animations were added first it was causing glitches on the first frame
      // this likely means we are doing some kind of destructive mutation to the clips... will look into it in more detail later
      for (let definedClip of loadInfo.clips || []) {
         const animation = object.animations.find(c => definedClip.map === c.name)

         let clipName = definedClip ? definedClip.name : animation.name
         let adjustedClip = THREE.AnimationUtils.subclip(animation, animation.name, 0, Math.round(animation.time * 24), 24)
         if (definedClip) {
            if (definedClip.add) {  
               var addToClip =  object.animations.find(c => c.name === definedClip.add)
               THREE.AnimationUtils.makeClipAdditive(adjustedClip, 0, addToClip || undefined)
            }
            
            if (definedClip.pose) {
               adjustedClip = THREE.AnimationUtils.subclip(animation, animation.name, 0, 1, 24 )
            }
            
            if(definedClip.stringed) {
               adjustedClip = THREE.AnimationUtils.subclip(animation, animation.name, 0.1, Math.round(animation.time * 24), 24 )
            }
         }
            
            
         const clip = this.mixer.clipAction(adjustedClip)
         clip.setEffectiveTimeScale(1)
         clip.setEffectiveWeight(0)
         clip.play()
         
         clip.c3_startAt = definedClip ? definedClip.startAt || 0 : 0
         clip.c3_weightCurrent = 0
         clip.c3_weightTarget = 0
         clip.c3_weightDampen = 1 / (60 * 0.15) // 0.15 sec
         clip.c3_then = false // function called when weight target met
         this.clips[clipName] = clip
      }
      
      this.instanceData = {
         id: 0,
         count: 0,
         mesh: undefined,
         idMap: {}, // helps with deleting indexes
         objectMap: [], // helps find a C3_Object
      }
   }
   
   /**
    * @param {string} [partName] inner part to clone
    * @returns {C3_Model}
    */   
   clone(partName) {
      const cloneObject = partName
         ? this.object.children[0].children.find(o => o.name === partName)
         : this.object.children[0]
      const clone = SkeletonUtils.clone(cloneObject)
      clone.animations = cloneObject.animations
      
      const newModel = this.c3.models.add({
         loadInfo: { ...this.loadInfo, name: this.name },
         object: clone,
         isClone: true
      })
      
      return newModel
   }
   
   // we can cut a lot of load time by only calling new InstancedMesh once per step
   // note all the instances and store all the changes in the lifespam of the step
   // at the end of the step update the instance
   instance(object) {
      if (!object) console.error('[C3_Model] creating instance without passing object');
      this.instanceData.id += 1
      this.instanceData.count += 1
      this.instanceData.idMap[this.instanceData.id] = this.instanceData.id - 1
      this.instanceData.objectMap.push(object)
      this.updateInstance()
      
      return {
         isInstance: true,
         model: this,
         id: this.instanceData.id,
         object: object,
      }
   }
   
   deleteInstance(id) {
      const { instanceData } = this
      instanceData.count -= 1
      const mapId = instanceData.idMap[id]
      
      // idk this doesn't feel right
      instanceData.objectMap = instanceData.objectMap.filter((o, i) => i != mapId)
      instanceData.idMap = {}
      
      let count = 0
      for (let object of instanceData.objectMap) {
         instanceData.idMap[object.mesh.id] = count
         count++
      }

      this.updateInstance()
   }
   
   updateInstance() {
      c3.scene.remove(this.instanceData.mesh)
      if (!this.instanceData.count) return
      const mesh = this.getMesh()
      const mat = this.getMaterial().clone()
      const geo = this.getGeometry().clone()
      
      // fix geometry
      const geoScale = this.getGeoScale()
      const rotation = mesh.rotation
      geo.scale(geoScale.x, geoScale.y, geoScale.z)
      geo.rotateZ(rotation.z)
      geo.rotateY(rotation.y)
      geo.rotateX(rotation.x)
      const offset = mesh.position.clone().multiply(geoScale)
      geo.translate(offset.x, offset.y, offset.z)

      this.instanceData.mesh = new THREE.InstancedMesh(geo, mat, this.instanceData.count)
      this.instanceData.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      // this.instanceData.offset = mesh.position.clone().multiply(geoScale)
      this.instanceData.mesh.c3_model = this
      if (!this.loadInfo.noCastShadow) {
         this.instanceData.mesh.castShadow = true
         this.instanceData.mesh.receiveShadow = true
      }
      c3.scene.add(this.instanceData.mesh)
   }
   
   boneToggle(boneName, model) {
      const bone = this.bones[boneName]
      const object = model.uuid ? model : model.object
      
      let isToggled = false
      bone.traverse((part) => {   
         if (part.uuid === object.uuid) isToggled = true
      })
      
      isToggled 
         ? this.boneRemove(boneName, model) 
         : this.boneAdd(boneName, model)
   }
   
   boneAdd(boneName, model) {
      this.bones[boneName].add(model.object ? model.object : model)
   }
   
   boneRemove(boneName, model) {
      this.bones[boneName].remove(model.object ? model.object : model)
   }
   
   boneClear(boneName) {
      const bone = this.bones[boneName]
      
      for (let i = bone.children.length - 1; i > 0; i--) {
         bone.remove(bone.children[i])
      }
   }
   
   animateSetClipTime(clipName, time) {
      const clip = this.clips[clipName]
      clip.time = time
   }
   
   animateStart(clipName, { time = 0 } = {}) {
      const clip = this.clips[clipName]
      clip.enabled = true
      clip.setEffectiveWeight(1)
      clip.play()
      
      clip.time = time
      this.currentClip = clip
   }
   
   // this was from legacy system
   animateStop(clipName) {
      // const clip = this.clips[clipName]
      this.animateWeight(clipName, 0, true)
   }
   
   animatePause(clipName) {
      const clip = this.clips[clipName]
      clip.paused = true
   }
   
   // shouldnt need to be a pose
   // if its a animation then pause it
   animateTo(clipName, time, then) {
      this.animateWeight(clipName, 1, time, () => {
         this.animateWeight(clipName, 0, 0)
         then && then()
      })
   }
   
   animateOut(clipName, time, then) {
      this.animateWeight(clipName, 0, time, () => {
         this.animateWeight(clipName, 0, 0)
         then && then()
      })
   }
   
   animateOnceTo(clipName, time, onEnd) {
      this.animateOnce(clipName, time, onEnd, true)
   }
   
   animateReverse(clipName, time, onEnd, dontResetWeightOnEnd) {
      // console.log(time)
      const clip = this.clips[clipName]
      const currTime = clip.time
      clip.reset()
      clip.setDuration(-time)
      clip.enabled = true
      clip.clampWhenFinished = true // keeps at last frame when finished
      clip.setLoop(THREE.LoopOnce, 1)
      clip.time = currTime
      // clip.timeScale = -1
      this.animateWeight(clipName, 1, 0)
      
      const stopAnimation = (e) => {
         if (e.action.getClip().name === clip._clip.name) {
            const weight = this.animateGetWeightTarget(clipName)
            const endedEarly = weight == 0
            onEnd && onEnd(endedEarly)
            if (!dontResetWeightOnEnd) {
               this.animateWeight(clipName, 0, 0)
               this.mixer.removeEventListener('finished', stopAnimation)
            }
         }
      }
         
      this.mixer.addEventListener('finished', stopAnimation)
   }
   
   animateOnce(clipName, time, onEnd, dontResetWeightOnEnd) {
      // console.log(time)
      const clip = this.clips[clipName]
      clip.setDuration(time)
      clip.reset()
      clip.enabled = true
      clip.clampWhenFinished = true // keeps at last frame when finished
      clip.setLoop(THREE.LoopOnce, 1)
      clip.time = 0
      this.animateWeight(clipName, 1, 0)
      
      const stopAnimation = (e) => {
         if (e.action.getClip().name === clip._clip.name) {
            const weight = this.animateGetWeightTarget(clipName)
            const endedEarly = weight == 0
            onEnd && onEnd(endedEarly)
            if (!dontResetWeightOnEnd) {
               this.animateWeight(clipName, 0, 0)
               this.mixer.removeEventListener('finished', stopAnimation)
            }
         }
      }
         
      this.mixer.addEventListener('finished', stopAnimation)
   }
   
   animateTime(clipName, time) {
      this.clips[clipName].time = time
   }
   
   animateSetDuration(clipName, time) {
      const clip = this.clips[clipName]
      clip.setDuration(time)
   }
   
   animateScale(clipName, scale) {
      this.clips[clipName].timeScale = scale
   }
   
   animateWeight(clipName, weight, time=null, then) {
      this.clips[clipName].c3_weightTarget = weight

      if (time == 0) {
         this.clips[clipName].c3_weightCurrent = weight
      }
      
      if (time) {
         this.clips[clipName].c3_weightDampen = 1 / (60 * time)
      }
      
      if (then) {
         this.clips[clipName].c3_then = then
      }
   }
   
   animateIsPlaying(clipName) {
      return this.clips[clipName].getEffectiveWeight() > 0
   }
   
   animateGetWeight(clipName) {
      return this.clips[clipName].c3_weightCurrent
      // return this.clips[clipName].getEffectiveWeight()
   }
   
   animateGetTime(clipName) {
      // 0 = start 1 = end
      const clip = this.clips[clipName]
      const duration = clip.getClip().duration
      if (clip.getEffectiveWeight() === 0) return 0
      return clip.time / duration
   }
   
   animateGetWeightTarget(clipName) {
      return this.clips[clipName].c3_weightTarget
   }
   
   animateGetPercentDone(clipName) {
      const clip = this.clips[clipName]
      return clip.getEffectiveWeight() ? (clip.time / clip.getClip().duration) : 0
   }
   
   loop(delta) {
      this.loopClipWeights(delta)
      this.mixer.update(delta)
      
      for (let endFunc of this.endFuncs) {
         endFunc()
      }
      this.endFuncs = []
   }
   
   loopClipWeights(delta) {
      // delta should probably be used in here somewhere
      for (const clipName of Object.keys(this.clips)) {
         const clip = this.clips[clipName]
         const dampen = clip.c3_weightDampen
         const currentWeight = clip.c3_weightCurrent
         const targetWeight = clip.c3_weightTarget
         
         let newWeight = clip.c3_weightTarget
         
         if (currentWeight > targetWeight) {
            newWeight = Math.max(targetWeight, currentWeight - dampen)
         }
         
         if (currentWeight < targetWeight) {
            newWeight = Math.min(targetWeight, currentWeight + dampen)
         }
            
         clip.c3_weightCurrent = newWeight
         clip.weight = newWeight
         clip.setEffectiveWeight(newWeight)
         
         if (currentWeight === targetWeight && clip.c3_then) {
            this.endFuncs.push(clip.c3_then)
            clip.c3_then = false
         }
      }
   }
   
   getPhysicsMeshes() {
      const meshes = []
      this.object.traverse(part => {
         // these are meshes manually added in a 3d editor
         if (part.name.startsWith('c3_phy_mesh')) {
            meshes.push({ mesh: part })
         }
      })
      
      return meshes
   }
   
   getGeometry() {
      return this.getMesh().geometry // lazy
   }
   
   getMaterial() {
      return this.getMesh().material // lazy
   }
   
   getMesh() {
      // get the mesh that isnt a c3_phyiscs
      return this.object.children[0].children.find(a => !a.name.startsWith('c3_'))
   }
   
   getGeoScale() {
      const mesh = this.getMesh()
      // const scale = new THREE.Vector3(1, 1, 1)
      const scale = mesh.scale.clone()
      mesh.traverseAncestors(a => {
         scale.multiply(a.scale)
      })
      
      return scale
   }
   
   destroy() {
      this.destroyed = true
      this.object.traverse((child) => {
         if (child.geometry !== undefined) child.geometry.dispose()
         if (child.texture !== undefined) child.texture.dispose()
         if (child.skeleton !== undefined) child.skeleton.dispose()
         if (child.material !== undefined) {
            let arrOfMaterials = Array.isArray(child.material) ? child.material : [child.material]
            for (let childMaterial of arrOfMaterials) {
               childMaterial.dispose()
            }
         }
      })
      
      if (this.object.parent) this.object.parent.remove(this.object)
      this.c3.models.remove(this)
   }
}
