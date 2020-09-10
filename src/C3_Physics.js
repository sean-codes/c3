import * as CANNON from '../node_modules/cannon-es/dist/cannon-es.js'
import * as THREE from '../node_modules/three/build/three.module.js'
import { ConvexGeometry } from '../node_modules/three/examples/jsm/geometries/ConvexGeometry.js'
import { CannonDebugRenderer } from '../node_modules/cannon-es-debugger-jsm/index.js'

export const SHAPES = {
   BOX: 'BOX',
   SPHERE: 'SPHERE',
   PLANE: 'PLANE',
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
      } = object.physics
      
      let {
         meshes
      } = object.physics
      
      const physicsMeshes = getPhysicsMeshes(meshes[0].mesh)
      if (physicsMeshes.length) {
         meshes = physicsMeshes
      }
      
      const { mesh, shape, hug } = meshes[0]
      
      const geo = mesh.geometry ? mesh.geometry : mesh.children[0].children[0].geometry
      const geoType = geo.type
      const objectPosition = object.getPosition()
      let bodyShape = shape
      let body = undefined
      let offset = new c3.Vector(0, 0, 0)
      
      const quaternion = new CANNON.Quaternion()
      quaternion.setFromEuler(mesh.rotation.x, mesh.rotation.y, mesh.rotation.z, 'XYZ')
      
      bodyShape = SHAPES.BOX
      if (geoType.startsWith('Plane')) bodyShape = SHAPES.PLANE
      if (geoType.startsWith('Sphere')) bodyShape = SHAPES.SPHERE
      if (geoType.startsWith('Cylinder')) bodyShape = SHAPES.CYLINDER
      if (geoType.startsWith('BufferGeometry')) bodyShape = SHAPES.MESH
      if (shape) bodyShape = shape

      if (bodyShape === SHAPES.BOX) {
         const innerMesh = getMesh(mesh)
         const { x, y, z } = innerMesh.position//objectPosition.add(innerMesh.position.clone().sub(objectPosition))
         const createdShapeData = createShapeBox(mesh)
   
         body = new CANNON.Body({
            shape: createdShapeData.shape,
            position: new CANNON.Vec3(0, 0, 0),
            material: this.materials[material],
            fixedRotation,
            quaternion,
            mass,
         })
         
         offset.x = x * object.getScale().x
         offset.y = y * object.getScale().y
         offset.z = z * object.getScale().z
         
         if (hug === HUG.BOTTOM) {
            offset.y += createdShapeData.height / 2
         }
      }
      
      if (bodyShape === SHAPES.PLANE) {
         const { x, y, z } = objectPosition.add(mesh.position.clone().sub(objectPosition))
         
         body = new CANNON.Body({
            fixedRotation,
            mass,
            quaternion,
            material: this.materials[material],
            position: new CANNON.Vec3(x, y, z),
            shape: new CANNON.Plane(),
         })

         body.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI/2)
      }
      
      if (bodyShape === SHAPES.SPHERE) {
         const { radius } = mesh.geometry.parameters
         const { x, y, z } = objectPosition.add(mesh.position.clone().sub(objectPosition))
         
         body = new CANNON.Body({
            fixedRotation,
            mass,
            quaternion,
            position: new CANNON.Vec3(x, y, z),
            shape: new CANNON.Sphere(radius),
            material: this.materials[material],
         })
      }
      
      if (bodyShape === SHAPES.CYLINDER) {
         const { radiusTop, radiusBottom, height, radialSegments } = mesh.geometry.parameters
         const { x, y, z } = objectPosition.add(mesh.position.clone().sub(objectPosition))
         
         // rotate the cylinder to map with threejs
         const shape = new CANNON.Cylinder(radiusTop, radiusBottom, height, radialSegments);
         var quat = new CANNON.Quaternion();
         quat.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI/2);
         var translation = new CANNON.Vec3(0, 0, 0);
         shape.transformAllPoints(translation, quat);
         
         body = new CANNON.Body({
            fixedRotation,
            mass,
            // quaternion,
            material: this.materials[material],
            position: new CANNON.Vec3(x, y, z),
            shape,
         })
      }
      
      if (bodyShape === SHAPES.MESH) {
         const { x, y, z } = objectPosition.add(mesh.position.clone().sub(objectPosition))
         
         body = new CANNON.Body({
            fixedRotation,
            quaternion,
            mass,
            material: this.materials[material],
            // position: new CANNON.Vec3(0, 2, 0),
            position: new CANNON.Vec3(x, y, z),
            shape: createShapeConvexPolyhedron(mesh),
         })
      }
      
      // Additional Bodies
      for (let i = 1; i < meshes.length; i++) {
         // console.log(meshes[i])
         const { mesh, shape, hug } = meshes[i]
         const geoType = mesh.geometry.type
         
         bodyShape = SHAPES.BOX
         if (geoType.startsWith('Plane')) bodyShape = SHAPES.PLANE
         if (geoType.startsWith('Sphere')) bodyShape = SHAPES.SPHERE
         if (geoType.startsWith('Cylinder')) bodyShape = SHAPES.CYLINDER
         if (geoType.startsWith('BufferGeometry')) bodyShape = SHAPES.MESH
         if (shape) bodyShape = shape
         
         
         if (bodyShape === SHAPES.BOX) {
            const innerMesh = getMesh(mesh)
            let { x, y, z } = innerMesh.position
            let createdShapeData = createShapeBox(mesh)
            const scale = object.getScale()
            
            const childBodyOffset = new CANNON.Vec3(
               x * scale.x - offset.x,
               y * scale.y - offset.y,
               z * scale.z - offset.z,
            )
            
            const childBodyQuarternion = new CANNON.Quaternion()
            childBodyQuarternion.setFromEuler(innerMesh.rotation.x, innerMesh.rotation.y, innerMesh.rotation.z, 'XYZ')
            
            body.addShape(createdShapeData.shape, childBodyOffset, childBodyQuarternion)
         }
         
         if (bodyShape === SHAPES.SPHERE) {
            const { radius } = mesh.geometry.parameters
            const { x, y, z } = objectPosition.add(mesh.position.clone().sub(objectPosition))
            const shape = new CANNON.Sphere(radius)
            body.addShape(shape, new CANNON.Vec3(x, y, z))
         }
         
         if (bodyShape === SHAPES.CYLINDER) {
            const { radiusTop, radiusBottom, height, radialSegments } = mesh.geometry.parameters
            const { x, y, z } = objectPosition.add(mesh.position.clone().sub(objectPosition))
            
            // rotate the cylinder to map with threejs
            const shape = new CANNON.Cylinder(radiusTop, radiusBottom, height, radialSegments);
            var quat = new CANNON.Quaternion();
            quat.setFromAxisAngle(new CANNON.Vec3(0, 1, 0),-Math.PI/2);
            var translation = new CANNON.Vec3(0, 0, 0);
            shape.transformAllPoints(translation,quat);
            
            body.addShape(shape, new CANNON.Vec3(x, y, z))
         }
         
         if(bodyShape === SHAPES.MESH) {
            const innerMesh = getMesh(mesh)
            let { x, y, z } = innerMesh.position
            const scale = object.getScale()
            const createdShapeData = createShapeConvexPolyhedron(mesh, scale)
            
            const childBodyOffset = new CANNON.Vec3(
               x * scale.x - offset.x,
               y * scale.y - offset.y,
               z * scale.z - offset.z,
            )
            
            const childBodyQuarternion = new CANNON.Quaternion()
            childBodyQuarternion.setFromEuler(innerMesh.rotation.x, innerMesh.rotation.y, innerMesh.rotation.z, 'XYZ')
            
            body.addShape(createdShapeData.shape, childBodyOffset, childBodyQuarternion)
         }
      }
      
      // cannot be applied in body constructor :,(
      body.collisionResponse = collisionResponse
      const physicObject = {
         object,
         body, 
         mesh, 
         linkToMesh,
         debug,
         offset,
         tempCollisions: [],
         collisions: []
      }
      
      if (watchCollisions) {
         body.addEventListener('collide', (event) => {
            const biIsSelf = event.contact.bi.id === physicObject.body.id
            const contactNormal = new CANNON.Vec3()
            // let obj1 = biIsSelf ? event.contact.bi : event.contact.bj
            let obj2 = biIsSelf ? event.contact.bj : event.contact.bi
            
            const other = this.list[obj2.id].object
            const normal = biIsSelf 
               ? event.contact.ni.negate(contactNormal) 
               : contactNormal.copy(contactNormal)
               
            const isOnGround = normal.y > 0.8
            physicObject.tempCollisions.push({ other, normal, isOnGround })
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
         const { object, body, linkToMesh, debug, offset } = this.list[physicObjectId]
         const { mesh } = object
         if(linkToMesh) {
            const meshWorldPosition = mesh.getWorldPosition(new THREE.Vector3())
            body.position.copy(meshWorldPosition)
            body.quaternion.copy(body.quaternion)
         } else {
            
            mesh.position.copy(body.position).sub(offset)
            mesh.quaternion.copy(body.quaternion)
         }
         
         if (debug) {
            debugBodies.push(body)
         }
      }
      
      if (this.debug) {
         this.debugger.update(debugBodies)
      }
   }
}


function createShapeBox(object) {
   const saveRotation = object.rotation.clone()
   object.rotation.set(0, 0, 0)
   const box = new THREE.Box3().setFromObject(object)
   object.rotation.copy(saveRotation)
   
   const size = {
      width: (box.max.x - box.min.x), //object.scale.x * mesh.scale.x),
      height: (box.max.y - box.min.y), //object.scale.y * mesh.scale.y),
      depth: (box.max.z - box.min.z), //object.scale.z * mesh.scale.z),
   }
   
   return {
      shape: new CANNON.Box(new CANNON.Vec3(size.width/2, size.height/2, size.depth/2)),
      ...size
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
   scale = scale || object.scale.clone().multiplyScalar(100)
   
   geometry.scale(scale.x, scale.y, scale.z)

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

function getMesh(object) {
   let mesh = undefined
   if (object.type === 'Mesh') return object
   object.traverse(part => mesh = part.type === 'Mesh' ? part : mesh)
   return mesh
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
