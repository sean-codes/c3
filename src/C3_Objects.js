export class C3_Objects {
   constructor(c3) {
      this.c3 = c3
      this.list = []
      this.idCounter = 0
   }

   create(GameObject, attr)  {
      const newObject = new GameObject(this.c3, this.idCounter, attr)

      this.list.push(newObject)
      this.c3.scene.add(newObject.mesh)
      this.idCounter += 1
      
      return newObject
   }
   
   destroy(gameObject) {
      
   }

   find(GameObjectType) {
      return this.list.find(gameObject => {
         return gameObject instanceof GameObjectType
      })
   }

   loop(delta) {
      for (const object of this.list) {
         object.step(delta)
      }
   }
}
