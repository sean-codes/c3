import { c3, TYPES } from './c3.js'
// import { global } from './global.js'


// console.log(global.data)
// global.data = 'wtf'
// console.log(global.data)
// c3.global.meow = 'aaaa'
// c3.objects.
// c3.mat
c3.scene.setBackground('#FFF')
c3.camera.setPosition(0, 0, -5)
c3.camera.lookAt(0, 0, 0)
c3.objects.add(TYPES.cube, { anAttribute: 'hello' })
// c3.objects.find(c3.types.cube)
// c3.objects.find(TYPES.cube)


// console.log(c3.objects.find())
