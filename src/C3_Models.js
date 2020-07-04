import { FBXLoader } from '../node_modules/three/examples/jsm/loaders/FBXLoader.js'

export class C3_Models {
   constructor(c3) {
      this.c3 = c3
      this.list = []
      this.materials = {}
   }
   
   add({ loadInfo, object, isClone }) {
      const newModel = new this.c3.Model({ loadInfo, object, isClone })
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
   
   load(models) {
      const loader = new FBXLoader()
      
      return new Promise((yay, nay) => {   
         let loading = models.length
         for (const loadInfo of models) {
            // const model = models[modelName]
            loader.load(loadInfo.file, (object) => {
               this.add({ loadInfo, object })
               if (loadInfo.log) console.log('Loaded Model', loadInfo.name, object)
               
               loading -= 1
               if (!loading) yay()
            }, null, (e) => { throw e })
         }
      })
   }
}
