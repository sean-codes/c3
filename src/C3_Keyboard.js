export class C3_Keyboard {
   constructor(c3) {
      this.c3 = c3
      this.keyMap = {}
      this.keys = {}
      this.events = []
      this.metas = []
      this.debug = false
      this.listen()
   }
   
   applyKeyMap(keyMap) {
      this.keyMap = keyMap
      this.keys = {}
      for (const keyName in keyMap) {
         const keyCode = keyMap[keyName].toLowerCase()
         this.keys[keyCode] = { up: false, down: false, held: false, keyCode }
      }
   }
   
   toggleDebug(toggle) {
      this.debug = toggle ?? true
   }

   listen() {
      if (typeof document !== 'undefined') {
         document.body.addEventListener('keydown', e => { !e.repeat && this.addEvent(e, 'down')})
         document.body.addEventListener('keyup', e => { this.addEvent(e, 'up') })
      }
   }
   
   addEvent(e, type) {
      let keyCode = e.key.toLowerCase()
      if (this.debug) console.log('C3 Keyboard: ', keyCode)
      if (e.ctrlKey || e.metaKey) keyCode = 'cmd+'+keyCode
      
      if (!this.keys[keyCode]) return
      e.preventDefault()

      this.events.push({
         keyCode,
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

   check(keyNameOrArrayOfKeys) {
      const returnVal = { up: false, down: false, held: false }
      const keyNames = Array.isArray(keyNameOrArrayOfKeys)
         ? keyNameOrArrayOfKeys 
         : [keyNameOrArrayOfKeys]
         
         for (const keyName of keyNames) {
            const map = this.keyMap[keyName]
            const status = this.keys[map] || this.keys[keyName]
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
