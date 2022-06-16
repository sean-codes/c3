import * as CANNON from '../node_modules/cannon-es/dist/cannon-es.js'
import * as THREE from '../node_modules/three/build/three.module.js'
import { ConvexGeometry } from '../node_modules/three/examples/jsm/geometries/ConvexGeometry.js'
import { CannonDebugRenderer } from '../node_modules/cannon-es-debugger-jsm/index.js'

export const SHAPES = {
   BOX: 'BOX',
   SPHERE: 'SPHERE',
   CYLINDER: 'CYLINDER',
   MESH: 'MESH',
}

export const HUG = {
   CENTER: 'CENTER',
   BOTTOM: 'BOTTOM',
   TOP: 'TOP',
}

export class C3_Physics {
   constructor(c3) {
      this.c3 = c3
      this.list = {}
      this.materials = {}
      this.SHAPES = SHAPES
      this.HUG = HUG
      this.world = new CANNON.World()
      this.world.gravity.set(0, -60, 0)
      this.debug = false
      this.debugger = new CannonDebugRenderer(this.c3.scene.object, this.world)
      
      this.world.addEventListener('endContact', ({ bodyA, bodyB }) => {
         if (bodyA && bodyB) {
            this.list[bodyA.id].contacts.delete(this.list[bodyB.id])
            this.list[bodyB.id].contacts.delete(this.list[bodyA.id])
         }
      })
      
      this.world.addEventListener('beginContact', ({ bodyA, bodyB }) => {
         if (bodyA && bodyB) {
            this.list[bodyA.id].contacts.add(this.list[bodyB.id])
            this.list[bodyB.id].contacts.add(this.list[bodyA.id])
         }
      })
   }
   
   
   addMaterial(name, options) {
      this.materials[name] = new CANNON.Material(options)
   }
   
   addObject(object) {
      const { 
         material, 
         mass=1, 
         fixedRotation=false, 
         linkToMesh=false,
         collisionResponse=true,
         watchCollisions=false,
         debug=false,
         checkIsOnGround=false,
         hug=HUG.CENTER,
         friction = 0,
         restitution = 0,
         meshes
      } = object.physics
      
      const phyMaterial = material 
         ? this.materials[material] 
         : new CANNON.Material({ friction, restitution })
      
      const meshData = getPhysicsMeshes(meshes, object)
      const quaternion = new CANNON.Quaternion()
      quaternion.setFromEuler(meshData[0].rotation.x, meshData[0].rotation.y, meshData[0].rotation.z, 'XYZ')
      
      let body = new CANNON.Body({
         position: new CANNON.Vec3(0, 0, 0),
         material: phyMaterial,
         collisionResponse,
         fixedRotation,
         quaternion,
         mass,
      })
      
      // const objectScale = object.getScale()
      const offset = new THREE.Vector3(0, 0, 0)
      for (let i = 0; i < meshData.length; i++) {
         const { mesh, shape, offsetY, isInstance } = meshData[i]

         let createdShapeData = undefined
         if (shape === SHAPES.BOX) createdShapeData = createShapeBox(meshData[i])
         if (shape === SHAPES.MESH) createdShapeData = createShapeConvexPolyhedron(meshData[i])
         // need to update these
         if (shape === SHAPES.SPHERE) createdShapeData = createShapeSphere(meshData[i])
         if (shape === SHAPES.CYLINDER) createdShapeData = createShapeCylinder(mesh)

         const innerMesh = getMesh(mesh)

         // offset
         const geoInfo = getMeshGeoInfo(innerMesh)

         const pScale = getMeshPositionScale(innerMesh)
         if  (meshData[i].isInstance) {
            const oScale = object.getScale()
            geoInfo.center.multiply(oScale)
            pScale.multiply(oScale)
         }

         const childBodyOffset = innerMesh.position.clone().multiply(pScale)
         childBodyOffset.add(geoInfo.center)
         
         if (offsetY) {
            childBodyOffset.y -= geoInfo.height * offsetY
         }

         // rotation. i can not figure out why I dont need this anymore
         // i think you are applying the rotation to the geometry itself
         const childBodyQuarternion = new CANNON.Quaternion()
         // .setFromEuler(
         //    innerMesh.rotation.x, 
         //    innerMesh.rotation.y, 
         //    innerMesh.rotation.z, 'XYZ')
         body.addShape(createdShapeData.shape, childBodyOffset, childBodyQuarternion)
      }
      
      // can we move this into a class?
      const physicObject = {
         object,
         body, 
         meshes,
         linkToMesh,
         debug,
         offset,
         isOnGround: false,
         checkIsOnGround,
         tempCollisions: [],
         collisions: [],
         contacts: new Set(),
         material: phyMaterial,
      }
      
      if (watchCollisions) {
         body.addEventListener('collide', (event) => {
            const biIsSelf = event.contact.bi.id === physicObject.body.id
            const contactNormal = new CANNON.Vec3()
            // let obj1 = biIsSelf ? event.contact.bi : event.contact.bj
            let obj2 = biIsSelf ? event.contact.bj : event.contact.bi
            if (!this.list[obj2.id]) return
            
            const other = this.list[obj2.id].object
            const normal = biIsSelf 
               ? event.contact.ni.negate(contactNormal) 
               : contactNormal.copy(contactNormal)
            
            physicObject.tempCollisions.push({ other, normal })
         })
      }
      
      body.position.copy(object.origin.position)
      this.world.addBody(body)
      this.list[body.id] = physicObject
      
      return physicObject
   }
   
   removeObject(physicsObject) {
      this.world.removeBody(physicsObject.body)
      delete this.list[physicsObject.body.id]
   }
   
   loopApplyCollisions() {
      for (const physicObjectId in this.list) {
         this.list[physicObjectId].collisions = this.list[physicObjectId].tempCollisions
         this.list[physicObjectId].tempCollisions = []
      }
   }
   
   loop() {
      this.world.step(1/60)

      const debugBodies = []
      for (const physicObjectId in this.list) {
         const { object, body, linkToMesh, debug, offset, checkIsOnGround, contacts } = this.list[physicObjectId]
         const { origin } = object
         
         // remove dead contacts
         for (var contact of contacts) {
            if (!contact.body.world) {
               contacts.delete(contact)
            }
         }
         
         if (linkToMesh) {
            const meshWorldPosition = origin.getWorldPosition(new THREE.Vector3())
            const meshWorldQuat = origin.getWorldQuaternion(new THREE.Quaternion())
            body.position.copy(meshWorldPosition)
            body.quaternion.copy(meshWorldQuat)
         } else {
            origin.position.copy(body.position).sub(offset)
            origin.quaternion.copy(body.quaternion)
         }
         
         if (checkIsOnGround) {
            this.list[physicObjectId].isOnGround = this.checkIsOnGround(body)
         }
         
         if (debug || this.debug) {
            debugBodies.push(body)
         }
      }
      
      this.debugger.update(debugBodies)
   }
   
   checkIsOnGround(body) {
      // need to rework this to use a shape to set width/depth of ground check
      body.computeAABB()
      const rayPositionFrom = body.position.clone()
      rayPositionFrom.y = body.aabb.lowerBound.y-1
      const rayPositionTo = rayPositionFrom.clone()
      rayPositionTo.y += 1.05
      
      const ray = new CANNON.Ray(rayPositionFrom, rayPositionTo)
      const bodiesWithoutself = this.world.bodies.filter(b => b.id !== body.id)
      ray.intersectBodies(bodiesWithoutself, ray.result)
      if (ray.result.hasHit) return true
   }
}

function createShapeBox(physicsMeshData) {
   const size = getSizeOfPhysicsMesh(physicsMeshData)

   return {
      shape: new CANNON.Box(new CANNON.Vec3(size.width/2, size.height/2, size.depth/2)),
      ...size
   }
}

function createShapeSphere(physicsMeshData) {
   // const size = getSizeOfMesh(object)
   const size = getSizeOfPhysicsMesh(physicsMeshData)
   return {
      shape: new CANNON.Sphere(size.radius),
      ...size
   }
}

function createShapeCylinder(object) {
   const mesh = getMesh(object)
   const { radiusTop, radiusBottom, height, radialSegments } = mesh.geometry.parameters
   
   // rotate the cylinder to map with threejs
   const shape = new CANNON.Cylinder(radiusTop, radiusBottom, height, radialSegments)
   var quat = new CANNON.Quaternion()
   quat.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI/2)
   var translation = new CANNON.Vec3(0, 0, 0)
   shape.transformAllPoints(translation, quat)
   
   return {
      shape: shape
   }
}

function createShapeConvexPolyhedron(physicsMeshData) {
   let mesh = physicsMeshData.mesh//(object)
   mesh.updateMatrixWorld()
   const geometry = new THREE.Geometry()
   geometry.fromBufferGeometry(mesh.geometry)
   geometry.rotateX(mesh.rotation.x)
   geometry.rotateY(mesh.rotation.y)
   geometry.rotateZ(mesh.rotation.z)
   
   // Do this  after rotating
   const scale = getMeshGeoScale(mesh)
   if (physicsMeshData.isInstance) {
      scale.multiply(physicsMeshData.object.getScale())
   }

   geometry.scale(scale.x, scale.y, scale.z)
   geometry.center()
   
   geometry.rotateX(-mesh.rotation.x)
   geometry.rotateY(-mesh.rotation.y)
   geometry.rotateZ(-mesh.rotation.z)

   // We have to move the points around so they aren't perfectly aligned?
   var eps = 1e-2; // between 2-4 seems to work
   for (var i = 0; i < geometry.vertices.length; i++) {
     geometry.vertices[i].x += (Math.random() - 0.5) * eps;
     geometry.vertices[i].y += (Math.random() - 0.5) * eps;
     geometry.vertices[i].z += (Math.random() - 0.5) * eps;
   }

   // create convex geometry
   var convexGeo = new ConvexGeometry(geometry.vertices);

   // get vertices and faces for cannon
   const vertices = convexGeo.vertices.map(v => new CANNON.Vec3(v.x, v.y, v.z));
   const faces = convexGeo.faces.map(f => [f.a, f.b, f.c]);
   
   return {
      shape: new CANNON.ConvexPolyhedron({ vertices, faces }),
      // ...size
   }
}

// I wrote this in the future. Some places are using this object incorrectly
function getPhysicsMeshes(meshes, object) {
   const meshesData = []
   
   const pushData = function(meshData, part) {
      const shape = meshData.shape || getShapeType(part)
      const { mesh: { isInstance, model }, offsetY } = meshData // :(

      meshesData.push({
         isInstance: isInstance,
         model: model,
         scale: isInstance ? object.getScale() : new THREE.Vector3(1, 1, 1),
         rotation: isInstance ? object.getRotation() : new THREE.Euler(0, 0, 0),
         shape: shape,//getShapeType(isInstance ? model.object : mesh),
         mesh: part,//getMesh(isInstance ? model.object : part),
         object: object,
         offsetY: offsetY,
      })
   }
   
   for (let meshData of meshes) {
      // working with regular mesh, c3_model, and instance :<
      let mainMesh = meshData.mesh
      if (mainMesh.isInstance) mainMesh = mainMesh.model.object
      if (mainMesh.object) mainMesh = mainMesh.object
      
      if (meshData.traverse) {
         mainMesh.traverse(part => {
            if (part.name.startsWith('c3_phy_mesh')) {
               pushData(meshData, part)
            }
         })
      } else {
         pushData(meshData, mainMesh)
      }
   }
   return meshesData
}

function getSizeOfPhysicsMesh(physicsMeshData) {
   const mesh = physicsMeshData.mesh
   if (physicsMeshData.isInstance) {
      const saveScale = mesh.scale.clone()
      mesh.scale.copy(mesh.scale.clone().multiply(physicsMeshData.scale))
      
      const size = getSizeOfMesh(mesh)
      mesh.scale.copy(saveScale)
      return size
   }
   
   return getSizeOfMesh(mesh)
}

function getSizeOfMesh(object) {
   const mesh = getMesh(object)
   const scale = getMeshScale(mesh)
   const geo = new THREE.BufferGeometry()
   mesh.geometry.type.includes('Buffer')
      ? geo.copy(mesh.geometry)
      : geo.fromGeometry(mesh.geometry)

   const mes = new THREE.Mesh(geo)
   mes.scale.copy(scale)
   mes.rotation.copy (mesh.rotation)
   const box = new THREE.Box3().setFromObject(mes)
   const size = {
      width: (box.max.x - box.min.x),
      height: (box.max.y - box.min.y),
      depth: (box.max.z - box.min.z),
   }
   
   size.radius = Math.max(size.width, size.height, size.depth)/2
   return size
}

function getMeshScale(mesh) {
   const scale = new THREE.Vector3(1, 1, 1).copy(mesh.scale)
   mesh.traverseAncestors(a => {
      scale.multiply(a.scale)
   })
   
   scale.applyEuler(mesh.rotation)
   return scale
}

function getMeshGeoScale(mesh) {
   const scale = new THREE.Vector3(1, 1, 1).copy(mesh.scale)
   mesh.traverseAncestors(a => {
      scale.multiply(a.scale)
   })
   
   return scale
}

function getMeshPositionScale(mesh) {
   const scale = new THREE.Vector3(1, 1, 1)
   mesh.traverseAncestors(a => {
      scale.multiply(a.scale)
   })
   
   return scale
}

function getMesh(object) {
   let mesh = undefined
   if (object.object) object = object.object
   if (object.type === 'Mesh') return object
   object.traverse(part => mesh = !mesh && part.type === 'Mesh' ? part : mesh)
   return mesh
}

function getShapeType(object) {
   const mesh = getMesh(object)
   const geo = mesh.geometry ? mesh.geometry : mesh.children[0].children[0].geometry
   const geoType = geo.type
   // pls fix
   // if (part.name.toLowerCase().includes('c3_phy_mesh') ? SHAPES.MESH : SHAPES.BOX
   
   if (geoType.startsWith('Sphere')) return SHAPES.SPHERE
   if (geoType.startsWith('Cylinder')) return SHAPES.CYLINDER
   if (geoType.startsWith('BufferGeometry')) return SHAPES.MESH
   return SHAPES.BOX
}

function getMeshGeoInfo(mesh) {
   const gScale = getMeshGeoScale(mesh)
   
   const tGeo = new THREE.BufferGeometry()
   mesh.geometry.type.includes('Buffer')
      ? tGeo.copy(mesh.geometry)
      : tGeo.fromGeometry(mesh.geometry)
   
   
   tGeo.rotateX(mesh.rotation.x)
   tGeo.rotateY(mesh.rotation.y)
   tGeo.rotateZ(mesh.rotation.z)
   tGeo.computeBoundingBox()
   return {
      center: tGeo.boundingBox.getCenter(new THREE.Vector3()).multiply(gScale), 
      height: (tGeo.boundingBox.max.y - tGeo.boundingBox.min.y) * gScale.y,
   }
}
