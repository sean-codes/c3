import { C3_Model } from "./C3_Model.js"

export class C3_Models {
   constructor(c3) {
      this.c3 = c3
      this.list = []
      this.id = 0
      this.materials = {}
   }
   
   add({ loadInfo, object, isClone }) {
      const newModel = new C3_Model({ c3: this.c3, id: this.id, loadInfo, object, isClone })
      this.list.push(newModel)
      this.id++
      
      return newModel
   }
   
   remove(modelToRemove) {
      this.list = this.list.reduce((sum, m) => {
         if (m.id !== modelToRemove.id) sum.push(m)
         return sum
      }, [])
      
      // if (!modelToRemove.destroyed) modelToRemove.destroy()
   }
   
   /**
   * @param {string} modelName name of model
   * @returns {C3_Model}
   */   
   find(modelName) {
      return this.list.find(m => m.name === modelName)
   }
   
   materialAdd(name, material) {
      this.materials[name] = material
   }
   
   materialFind(name) {
      return this.materials[name]
   }
   
   loop(delta) {
      for (const model of this.list) {
         model.loop(delta)
      }
   }
}
