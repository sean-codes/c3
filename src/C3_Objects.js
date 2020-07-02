export class C3_Objects {
   constructor(c3) {
      this.c3 = c3
      this.list = []
      this.idCounter = 0
   }

   add(GameObject, attr)  {
      const newObject = new GameObject({ id: this.idCounter, attr: attr })
      this.list.push(newObject)
      c3.scene.add(newObject.mesh)
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
