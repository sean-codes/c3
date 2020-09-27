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
      this.debug = true
      this.debugger = new CannonDebugRenderer(this.c3.scene.object, this.world)
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
      } = object.physics
      
      const phyMaterial = material 
         ? this.materials[material] 
         : new CANNON.Material({ friction, restitution })
         console.log(phyMaterial)
         
      let {
         meshes
      } = object.physics
      
      const physicsMeshes = getPhysicsMeshes(meshes[0].mesh)
      if (physicsMeshes.length) {
         meshes = physicsMeshes
      }
      
      const quaternion = new CANNON.Quaternion()
      quaternion.setFromEuler(meshes[0].mesh.rotation.x, meshes[0].mesh.rotation.y, meshes[0].mesh.rotation.z, 'XYZ')
      
      let body = new CANNON.Body({
         position: new CANNON.Vec3(0, 0, 0),
         material: phyMaterial,
         collisionResponse,
         fixedRotation,
         quaternion,
         mass,
      })
      
      const objectScale = object.getScale()
      const offset = new THREE.Vector3(0, 0, 0)
      for (let i = 0; i < meshes.length; i++) {
         const { mesh, shape, offsetY } = meshes[i]
         const bodyShape = shape || getShapeType(mesh)
         let createdShapeData = undefined
         if (bodyShape === SHAPES.BOX) createdShapeData = createShapeBox(mesh)
         if (bodyShape === SHAPES.SPHERE) createdShapeData = createShapeSphere(mesh)
         if (bodyShape === SHAPES.CYLINDER) createdShapeData = createShapeCylinder(mesh)
         if (bodyShape === SHAPES.MESH) createdShapeData = createShapeConvexPolyhedron(mesh)

         const innerMesh = getMesh(mesh)
         
         // offset
         const geoInfo = getMeshGeoInfo(innerMesh)
         const pScale = getMeshPositionScale(innerMesh)
         const childBodyOffset = innerMesh.position.clone().multiply(pScale)
         childBodyOffset.add(geoInfo.center)
         
         if (offsetY) {
            childBodyOffset.y -= geoInfo.height * offsetY
         }
         
         // rotation
         const childBodyQuarternion = new CANNON.Quaternion().setFromEuler(
            innerMesh.rotation.x, 
            innerMesh.rotation.y, 
            innerMesh.rotation.z, 'XYZ')
         
         body.addShape(createdShapeData.shape, childBodyOffset, childBodyQuarternion)
      }
      
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
         const { object, body, linkToMesh, debug, offset, checkIsOnGround } = this.list[physicObjectId]
         const { origin } = object
         if (linkToMesh) {
            const meshWorldPosition = origin.getWorldPosition(new THREE.Vector3())
            body.position.copy(meshWorldPosition)
            body.quaternion.copy(body.quaternion)
         } else {
            origin.position.copy(body.position).sub(offset)
            origin.quaternion.copy(body.quaternion)
         }
         
         if (checkIsOnGround) {
            this.list[physicObjectId].isOnGround = this.checkIsOnGround(body)
         }
         
         if (debug) {
            debugBodies.push(body)
         }
      }
      
      if (this.debug) {
         this.debugger.update(debugBodies)
      }
   }
   
   checkIsOnGround(body) {
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

function createShapeBox(object) {
   const size = getSizeOfMesh(object)
   return {
      shape: new CANNON.Box(new CANNON.Vec3(size.width/2, size.height/2, size.depth/2)),
      ...size
   }
}

function createShapeSphere(object) {
   const size = getSizeOfMesh(object)
   
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

function createShapeConvexPolyhedron(object, scale) {
   let mesh = getMesh(object)
   mesh.updateMatrixWorld()
   const geometry = new THREE.Geometry()
   geometry.fromBufferGeometry(mesh.geometry)
   geometry.rotateX(mesh.rotation.x)
   geometry.rotateY(mesh.rotation.y)
   geometry.rotateZ(mesh.rotation.z)
   
   // Do this  after rotating
   scale = scale || getMeshGeoScale(mesh)
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

function getPhysicsMeshes(object) {
   const meshes = []
   object.traverse(part => {
      if (part.name.startsWith('c3_phy_mesh')) {
         const shape = part.name.toLowerCase().includes('convex') ? SHAPES.MESH : SHAPES.BOX
         meshes.push({ mesh: part, shape })
      }
   })
   
   return meshes
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
   if (object.type === 'Mesh') return object
   object.traverse(part => mesh = !mesh && part.type === 'Mesh' ? part : mesh)
   return mesh
}

function getShapeType(object) {
   const mesh = getMesh(object)
   const geo = mesh.geometry ? mesh.geometry : mesh.children[0].children[0].geometry
   const geoType = geo.type
   
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
