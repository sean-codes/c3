export class C3_Object {
  constructor(attributes) {
    console.log('meow')
    this.create(attributes)
  }
  
   create() {
     
   }
   
   move(x, y) {
     console.log('inner function', x, y)
   }
}