// This is awful :]
// Lets us write extends c3.Object and not need ot use this.c3
import { C3 } from '../../src/C3.js'
export const c3 = new C3()
window.c3 = c3
