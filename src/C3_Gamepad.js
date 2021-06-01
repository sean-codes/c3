// lazy write this for single pad first

export class C3_Gamepad {
   constructor() {
      this.gamepads = {}
      this.listen()
      this.gamepadCount = 0
   }
   
   listen() {
      window.addEventListener('gamepadconnected', (e) => { this.gamepadCount += 1 })
      window.addEventListener('gamepaddisconnected', (e) => { this.gamepadCount -= 1 })
   }
   
   read() {
      if (!this.gamepadCount) return undefined
      
      const gamepad = navigator.getGamepads()[0]
      
      if (gamepad) {
         // PS4 on Mac OS mapping (not sure changes per controller)
         return {
            // pls make deadzone adjustable 
            anolog_left_x: Math.abs(gamepad.axes[0]) < 0.2 ? 0 : gamepad.axes[0],
            anolog_left_y: Math.abs(gamepad.axes[1]) < 0.2 ? 0 : gamepad.axes[1],
            anolog_right_x: Math.abs(gamepad.axes[2]) < 0.2 ? 0 : gamepad.axes[2],
            anolog_right_y: Math.abs(gamepad.axes[3]) < 0.2 ? 0 : gamepad.axes[3],
            
            dpad_up: gamepad.buttons[12],
            dpad_down: gamepad.buttons[13],
            dpad_left: gamepad.buttons[14],
            dpad_right: gamepad.buttons[15],
            start: gamepad.buttons[9],
            options: gamepad.buttons[8],
            left_bumper: gamepad.buttons[4],
            right_bumper: gamepad.buttons[5],
            left_trigger: gamepad.buttons[6],
            right_trigger: gamepad.buttons[7],
            x: gamepad.buttons[0],
            circle: gamepad.buttons[1],
            square: gamepad.buttons[2],
            triangle: gamepad.buttons[3],
            anolog_left_click: gamepad.buttons[10],
            anolog_right_click: gamepad.buttons[11]
         }
      }
   }
}
