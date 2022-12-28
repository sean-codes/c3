// lazy write this for single pad first
// buttons and keyboard keys will map the same

export class C3_Gamepad {
   constructor(c3) {
      this.c3 = c3
      this.map = new GamepadMap(c3)
   }
   
   loop() {
      const gamepad = this.getGamepad()
      
      if (gamepad) {
         this.map.update(gamepad)
      }
   }
   
   getGamepad() {
      const isScreenFocused = document.hasFocus()
      if (!isScreenFocused) return

      const gamepads = navigator.getGamepads ? navigator.getGamepads() : []
      if (!gamepads.length) return
      
      // temporary
      return gamepads[0] || gamepads[1]
   }

   read() {
      return this.map
   }

   vibrate(duration, scale = 1) {
      const gamepad = this.getGamepad()
      const viber = gamepad && gamepad.vibrationActuator
      if (gamepad && viber) {
         viber.playEffect('dual-rumble', {
            startDelay: 0, duration: duration, weakMagnitude: 1.0*scale, strongMagnitude: 1.0*scale 
         })
      }
   }
   
   setDeadzone(deadzone) {
      this.map.anolog_left.deadzone = deadzone
      this.map.anolog_right.deadzone = deadzone
   }
}

class GamepadMap {
   constructor(c3) {
      this.c3 = c3
      // PS4 on Mac OS mapping (not sure changes per controller)
      this.anolog_left = new GamepadAnolog(this.c3)
      this.anolog_right = new GamepadAnolog(this.c3)
      this.dpad_up = new GamepadButton(this.c3, 12)
      this.dpad_down = new GamepadButton(this.c3, 13)
      this.dpad_left = new GamepadButton(this.c3, 14)
      this.dpad_right = new GamepadButton(this.c3, 15)
      this.start = new GamepadButton(this.c3, 9)
      this.options = new GamepadButton(this.c3, 8)
      this.r1 = new GamepadButton(this.c3, 5)
      this.r2 = new GamepadButton(this.c3, 7)
      this.l1 = new GamepadButton(this.c3, 4)
      this.l2 = new GamepadButton(this.c3, 6)
      this.x = new GamepadButton(this.c3, 0)
      this.circle = new GamepadButton(this.c3, 1)
      this.square = new GamepadButton(this.c3, 2)
      this.triangle = new GamepadButton(this.c3, 3)
      this.anolog_left_click = new GamepadButton(this.c3, 10)
      this.anolog_right_click = new GamepadButton(this.c3, 11)
   }
   
   update(gamepad) {
      // not even a loop
      this.anolog_left.update(gamepad.axes[0], gamepad.axes[1])
      this.anolog_right.update(gamepad.axes[2], gamepad.axes[3])
      this.dpad_up.update(gamepad)
      this.dpad_down.update(gamepad)
      this.dpad_left.update(gamepad)
      this.dpad_right.update(gamepad)
      this.start.update(gamepad)
      this.options.update(gamepad)
      this.r1.update(gamepad)
      this.r2.update(gamepad)
      this.l1.update(gamepad)
      this.l2.update(gamepad)
      this.x.update(gamepad)
      this.circle.update(gamepad)
      this.square.update(gamepad)
      this.triangle.update(gamepad)
      this.anolog_left_click.update(gamepad)
      this.anolog_right_click.update(gamepad)
   }
}

class GamepadButton {
   constructor(c3, index) {
      this.c3 = c3
      this.index = index
      
      this.value = 0
      this.status = {
         up: false,
         held: false,
         down: false,
      }
   }
   
   update(gamepad) {
      // line order here matters. i am confused
      const button = gamepad.buttons[this.index]
      this.status.down = false
      
      if (button.pressed) {
         this.c3.lastInputType = this.c3.const.INPUT_GAMEPAD

         if (!this.status.held) {
            this.status.down = Date.now()
            this.c3.userOnInput && this.c3.userOnInput()
         }
         this.status.held = this.status.held || Date.now()
      } else {
         if (this.status.up) { this.status.held = false; this.status.up = false } // yikes
         if (this.status.held) this.status.up = Date.now()
      }
   }
}

class GamepadAnolog {
   constructor(c3) {
      this.c3 = c3
      this.x = 0
      this.y = 0
      this.rawX = 0
      this.rawY = 0
      this.angleRadians = 0
      this.angleDegrees = 0
      this.len = 0
      // pls make this adjustable
      this.deadzone = 0.5
   }
   
   update(x, y) {

      var xR = Math.round(x*100)/100
      var yR = Math.round(y*100)/100
      this.rawX = xR
      this.rawY = yR

      // reset
      this.len = 0
      this.x = 0
      this.y = 0
      this.angleRadians = 0
      this.anfleDegress = 0
      
      if (xR || yR) {
         
         const len = Math.min(Math.round(Math.sqrt(xR*xR+yR*yR)*100)/100, 1)
         const pastDeadzone = len > this.deadzone       
         this.len = len
         
         if (pastDeadzone) {
            // pull the deadzone out of x/y
            // this gives you a smoother range:
            const uv = [xR*(1/len), yR*(1/len)]
            const range = 1 - this.deadzone
            const removeDeadzone = len - this.deadzone
            const wtf = removeDeadzone / range
            
            // "0 - 1" vs "deadzone - 1"
            this.x = Math.round(uv[0]*wtf*100)/100
            this.y = Math.round(uv[1]*wtf*100)/100

            // set angle
            this.angleRadians = Math.atan2(-x, y)
            this.angleDegrees = this.angleRadians / Math.PI * 180 + 180 // 0 top clockwise

            // set input type
            this.c3.lastInputType = this.c3.const.INPUT_GAMEPAD
            this.c3.userOnInput && this.c3.userOnInput()
         }
      }
   }
}
