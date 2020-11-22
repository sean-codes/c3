export class C3_Storage {
   constructor(c3) {
      this.c3 = c3
      this.data = {}
   }

   init(storages) {
      for (const storage of storages) {
         this.write(storage)
      }
   }

   read(location) {
      return JSON.parse(this.data[location])
   }

   write(options) {
      this.data[options.location] = JSON.stringify(options.data)
      if (options.save) this.save(options.location)
   }

   // reminds me of bash ls command
   ls(location) {
      const startsWith = this.c3.default(location, '')
      const list = []
      for (const storageName of Object.keys(this.data)) {
         if (storageName.startsWith(startsWith)) {
            list.push(storageName)
         }
      }
      return list
   }

   save(location) {
      // local storage
      window.localStorage.setItem(location, this.data[location])
   }
}
