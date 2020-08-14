export class C3_Textures {
   constructor(c3) {
      this.c3 = c3
      this.list = []
   }
   
   add({ loadInfo, texture }) {
      const newTexture = new this.c3.Texture({ c3: this.c3, loadInfo, texture })
      this.list.push(newTexture)
      
      return newTexture
   }
   
   find(textureName) {
      return this.list.find(m => m.name === textureName)
   }
}
