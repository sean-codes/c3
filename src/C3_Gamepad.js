// lazy write this for single pad first
// buttons and keyboard keys will map the same

export class C3_Gamepad {
   constructor() {
      this.listen()
      this.gamepadCount = 0
      this.map = new GamepadMap()
   }
   
   listen() {
      window.addEventListener('gamepadconnected', (e) => { this.gamepadCount += 1})
      window.addEventListener('gamepaddisconnected', (e) => { this.gamepadCount -= 1 })
   }
   
   loop() {
      if (!this.gamepadCount) return undefined
      
      const gamepad = navigator.getGamepads()[0]
      if (gamepad) {
         this.map.update(gamepad)
      }
   }
   
   read() {
      return this.map
   }
}

class GamepadMap {
   constructor() {
      // PS4 on Mac OS mapping (not sure changes per controller)
      this.anolog_left = new GamepadAnolog()
      this.anolog_right = new GamepadAnolog()
      this.dpad_up = new GamepadButton(12)
      this.dpad_down = new GamepadButton(13)
      this.dpad_left = new GamepadButton(14)
      this.dpad_right = new GamepadButton(15)
      this.start = new GamepadButton(9)
      this.options = new GamepadButton(8)
      this.r1 = new GamepadButton(5)
      this.r2 = new GamepadButton(7)
      this.l1 = new GamepadButton(4)
      this.l2 = new GamepadButton(6)
      this.x = new GamepadButton(0)
      this.circle = new GamepadButton(1)
      this.square = new GamepadButton(2)
      this.triangle = new GamepadButton(3)
      this.anolog_left_click = new GamepadButton(10)
      this.anolog_right_click = new GamepadButton(11)
   }
   
   update(gamepad) {
      // not even a loop
      this.anolog_left.update(gamepad.axes[0], gamepad.axes[1])
      this.anolog_right.update(gamepad.axes[1], gamepad.axes[2])
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
   constructor(index) {
      this.index = index
      this.down = false
      this.up = false
      this.held = false
      this.value = 0
   }
   
   update(gamepad) {
      const button = gamepad.buttons[this.index]
      this.down = false
      this.up = false
      
      if (button.pressed) {
         if (!this.held) {
            this.down = true
         }
         this.held = true
      } else {
         if (this.held) {
            this.up = true
         }
         this.held = false
      }
   }
}

class GamepadAnolog {
   constructor() {
      this.x = 0
      this.y = 0
      this.rawX = 0
      this.rawY = 0
      // pls make this adjustable
      this.deadzone = 0.2
   }
   
   update(x, y) {
      this.rawX = x
      this.rawY = y
      this.x = Math.abs(x) > this.deadzone ? x : 0
      this.y = Math.abs(y) > this.deadzone ? y : 0
   }
}
