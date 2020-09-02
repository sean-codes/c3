export class C3_Keyboard {
   constructor() {
      this.keyMap = {}
      this.keys = {}
      this.events = []
      this.listen()
   }
   
   applyKeyMap(keyMap) {
      this.keyMap = keyMap
      this.keys = {}
      for (const keyName in this.keyMap) {
         const keyCode = this.keyMap[keyName]
         this.keys[keyCode] = { up: false, down: false, held: false }
      }
   }
   
   listen() {
      document.body.addEventListener('keydown', e => { !e.repeat && this.addEvent(e.keyCode, 'down')})
      document.body.addEventListener('keyup', e => { this.addEvent(e.keyCode, 'up') })
   }
   
   addEvent(keyCode, type) {
      if (!this.keys[keyCode]) return
      this.events.push({
         key: this.keys[keyCode],
         type,
      })
   }

   execute() {
      for (let i = 0; i < this.events.length; i += 1) {
         const { key, type } = this.events[i]
         this.processEvent(key, type)
      }
      this.events = []
   }
   
   processEvent(key, type) {
      if (type === 'up') {
         if (!key.held) return
         key.up = performance.now()
         key.held = false
         return
      }
      
      // type is down
      key.down = performance.now()
   }
   
   // onKeyDown(keyCode) {
   //    if (!this.keys[keyCode]) return
   //    this.keys[keyCode] = { up: false, down: true, held: false }
   // }
   // 
   // onKeyUp(keyCode) {
   //    if (!this.keys[keyCode]) return
   //    this.keys[keyCode] = { up: true, down: false, held: false }
   // }

   check(keyNameOrArrayOfKeys) {
      const returnVal = { up: false, down: false, held: false }
      const keyNames = Array.isArray(keyNameOrArrayOfKeys)
         ? keyNameOrArrayOfKeys 
         : [keyNameOrArrayOfKeys]
   

      for (const keyName of keyNames) {
         // if key is a string map it to a keycode. else use as is
         const keyCode = typeof keyName === 'string' ? this.keyMap[keyName] : keyName
         const status = this.keys[keyCode]
         if (!status) continue
         
         returnVal.up = returnVal.up || status.up
         returnVal.down = returnVal.down || status.down
         returnVal.held = returnVal.held || status.held
      }
      
      return returnVal
   }

   resetKeys() {
      for (const keyId in this.keys) {
         const key = this.keys[keyId]
         if (key.down) key.held = performance.now()
         
         key.up = false
         key.down = false
      }
      
      this.execute()
   }
}
