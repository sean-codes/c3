export class C3_Models {
   constructor(c3) {
      this.c3 = c3
      this.list = []
      this.materials = {}
   }
   
   add({ loadInfo, object, isClone }) {
      const newModel = new this.c3.Model({ c3: this.c3, loadInfo, object, isClone })
      this.list.push(newModel)
      
      return newModel
   }
   
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
