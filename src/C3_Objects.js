import { C3_Object } from './C3_Object.js'

export class C3_Objects {
   constructor(c3) {
      this.c3 = c3
      this.list = []
      this.idCounter = 0
   }

   /**
   * @returns {C3_Object}
   */
   create(GameObject, attr)  {
      this.idCounter += 1
      const newObject = new GameObject(this.c3, this.idCounter, attr, GameObject)

      this.list.push(newObject)
      if (!newObject.origin.parent) {
         this.c3.scene.add(newObject.origin)
      }
      
      return newObject
   }
   
   removeFromList(gameObject) {
      this.list = this.list.filter(o => {
         return gameObject.id !== o.id
      })
   }

   /**
   * @returns {C3_Object}
   */
   find(GameObjectType) {
      return this.list.find(gameObject => {
         return gameObject instanceof GameObjectType
      })
   }
   
   /**
   * @returns {Array<C3_Object>}
   */
   findAll(GameObjectType) {
      const arrTypes = typeof GameObjectType === 'object' ? GameObjectType : [GameObjectType]
      
      return this.list.filter(object => {
         return arrTypes.some(type => { 
            return object instanceof type
         })
      })
   }

   loop(delta) {
      for (const object of this.list) {
         object.engineStep(delta)
         object.step(delta)
      }
   }
}
