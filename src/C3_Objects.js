export class C3_Objects {
  constructor() {
    this.list = []
  }
  
  add(GameObject, attributes) {
    const newObject = new GameObject(attributes)
    this.list.push([{ type: GameObject.constructor.name, object: newObject }])
    
    return newObject
  }
  
  find(GameObjectType) {
    return this.list.find(gameObject => {
      return gameObject.object instanceof GameObjectType
    })
  }
}