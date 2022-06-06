export class C3_Keyboard {
   constructor(c3) {
      this.c3 = c3
      this.keyMap = {}
      this.keys = {}
      this.events = []
      this.metas = []
      this.listen()
   }
   
   applyKeyMap(keyMap) {
      this.keyMap = keyMap
      this.keys = {}
      for (const keyName in this.keyMap) {
         const keyCode = this.keyMap[keyName]
         this.keys[keyCode] = { up: false, down: false, held: false, keyCode }
      }
   }
   
   listen() {
      document.body.addEventListener('keydown', e => { !e.repeat && this.addEvent(e, 'down')})
      document.body.addEventListener('keyup', e => { this.addEvent(e, 'up') })
   }
   
   addEvent(e, type) {
      e.preventDefault()
      
      const metaKey = e.metaKey
      const keyCode = e.keyCode
      if (!this.keys[keyCode]) return
      
      this.events.push({
         keyCode,
         key: this.keys[keyCode],
         type,
      })
      
      if (metaKey) {
         this.metas.push(this.keys[keyCode])
      }
   }

   execute() {
      for (let i = 0; i < this.events.length; i += 1) {
         const { key, type, metaKey } = this.events[i]
         this.processEvent(key, type, metaKey)
      }
      this.events = []
   }
   
   processEvent(key, type) {
      this.c3.lastInputType = this.c3.const.INPUT_KEYBOARD
      
      if (type === 'up') {
         if (!key.held) return
         key.up = Date.now()
         // key.held = false
         
         if (key.keyCode === 91) {
            this.liftEverything()
         }
         return
      }
      
      // type is down
      key.down = Date.now()
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
         if (key.down) key.held = Date.now()
         if (key.up) key.held = false
         key.up = false
         key.down = false
      }
      
      this.execute()
   }
   
   // something weird with meta key blocking keyups
   liftEverything() {
      for (let keyCode in this.keys) {
         this.keys[keyCode].up = this.keys[keyCode.down] ? true : false
         this.keys[keyCode].held = false
      }
   }
}
