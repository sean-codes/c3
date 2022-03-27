// -------------------------------------------------------------------------- //
// ---------------------------| C3 ENGINE: NETWORK |------------------------- //
// -------------------------------------------------------------------------- //
export class C3_Network {
   constructor(cs) {
      this.cs = cs

      this.ws = {}
      this.status = false
      this.connecting = false
      this.buffer = []

      this.metrics = {
         upNow: 0,
         downNow: 0,
         upAverage: 0,
         downAverage: 0,
         upTotal: 0,
         downTotal: 0,
         upWatch: 0,
         downWatch: 0,
         last: Date.now(),
         count: 0,
      }

      this.user = {
         connect: undefined,
         disconnect: undefined,
         message: undefined,
      }
   }

   updateMetrics() {
      if (!this.cs.network.status) return
      
      const { metrics } = this.cs.network
      const now = Date.now()
      if (now - metrics.last > 1000) {
         metrics.count += 1
         metrics.last = now
         metrics.upNow = metrics.upWatch
         metrics.downNow = metrics.downWatch
         metrics.upTotal += metrics.upWatch
         metrics.downTotal += metrics.downWatch
         metrics.upAverage = metrics.upTotal / metrics.count
         metrics.downAverage = metrics.downTotal / metrics.count

         metrics.upWatch = 0
         metrics.downWatch = 0
      }
   }
   
   connect({
      host=window.location.hostname,
      ssl=false,
      port=1180,
   }) {
      try {
         this.connecting = true
         let url = 'wss://' + host + ':' + port

         if (ssl === undefined || ssl === false) {
            url = 'ws://' + host + ':' + port
         }
         
         const ws = new WebSocket(url)
         
         ws.onopen = () => {
            this.connecting = false
            this.onConnect()
         }
         // ws.onerror = (e) => {}
         ws.onclose = () => { this.onDisconnect() }
         ws.onmessage = (event) => { this.onMessage(event.data) }
         this.cs.network.ws = ws
      } catch (e) {
         this.connecting = false
         console.log(e)
      }
   }

   isConnected() {
      return this.cs.network.ws.readyState !== this.cs.network.ws.CLOSED
   }

   send(data) {
      if (!this.status) return
      if (typeof data !== 'string') {
         data = JSON.stringify(data)
      }
      this.cs.network.metrics.upWatch += data.length
      this.cs.network.ws.send(data)
   }

   read() {
      while (this.buffer.length) {
         const message = this.buffer.shift()
         this.metrics.downWatch += message.length
         try {
            this.user.message(message)
         } catch (e) {
            console.error('could not parse message', e)
         }
      }
   }

   onConnect() {
      this.cs.network.status = true
      if (this.user.connect) this.user.connect({ cs: this.cs })
   }

   onDisconnect() {
      this.connecting = false
      this.cs.network.status = false
      if (this.user.disconnect) this.user.disconnect({ cs: this.cs })
   }

   onMessage(message) {
      this.buffer.push(message)
   }
   
   setup(options={}) {
      for (const optionName in options) {
         this.cs.network.user[optionName] = options[optionName]
      }
   }
}
