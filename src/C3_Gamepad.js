// lazy write this for single pad first
// buttons and keyboard keys will map the same

export class C3_Gamepad {
   constructor(c3) {
      this.c3 = c3
      this.map = new GamepadMap(c3)
   }
   
   loop() {
      const isScreenFocused = document.hasFocus()
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : []
      if (!gamepads.length || !isScreenFocused) return undefined
      
      if (gamepads[0]) {
         this.map.update(gamepads[0])
      }
   }
   
   read() {
      return this.map
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
      // pls make this adjustable
      this.deadzone = 0.5
   }
   
   update(x, y) {
      this.rawX = x
      this.rawY = y
      const pastDeadzone = Math.max(Math.abs(x), Math.abs(y)) > this.deadzone
      this.x = pastDeadzone ? x : 0
      this.y = pastDeadzone ? y : 0
      this.angleRadians = Math.atan2(-this.x, this.y)
      this.angleDegrees = this.angleRadians / Math.PI * 180 + 180 // 0 top clockwise

      if (this.x || this.y) {
         this.c3.lastInputType = this.c3.const.INPUT_GAMEPAD
         this.c3.userOnInput && this.c3.userOnInput()
      }
   }
}
