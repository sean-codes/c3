/**
 * Gets a random number between range
 * @param {number} min
 * @param {number} max
 */
export function randomRange(min, max) {
  const range = max - min
  return Math.random() * range + min
}

/**
 * Gets a random number between range rounded
 * @param {number} min
 * @param {number} max
 */
export function iRandomRange(min, max) {
  return Math.round(this.randomRange(min, max))
}

/**
 * Gets a random number rounded
 * @param {number} number
 */
export function iRandom(num) {
  return Math.round(Math.random() * num)
}

/**
 * @param {number} point
 * @param {number} radius
 */
export function randomPointFromPoint(point, radius) {
  const angle = Math.PI * 2 * Math.random()
  return new c3.Vector(
    point.x + Math.cos(angle) * radius,
    point.y,
    point.z + Math.sin(angle) * radius
  )
}

/**
 * Chooses a random index from an array
 * @param {Array} array
 */
export function choose(array) {
  return array[this.iRandomRange(0, array.length - 1)]
}

/**
 * Gets the angle between two angles
 * @param {number} angle1
 * @param {number} angle2
 */
export function angleBetween(a1, a2) {
  const angleDiff = c3.math.angleToAngle(a1, a2)
  return a1 + angleDiff / 2
}

/**
 * Finds the small angle to get from 1 -> 2
 * @param {number} angle1
 * @param {number} angle2
 */
export function angleToAngle(a1, a2) {
  let right = a2 - a1
  if (right < 0) {
    right = Math.PI * 2 + right
  }

  let left = a1 - a2
  if (left < 0) {
    left = Math.PI * 2 + left
  }

  return right > left ? -left : right
}

/**
 * Keeps and angle between 0 and Math.PI*2
 * @param {number} angle
 */
export function loopAngle(a) {
  let modAngle = a % (Math.PI * 2)
  if (modAngle < 0) {
    modAngle = Math.PI * 2 + modAngle
  }

  if (modAngle > Math.PI * 2) {
    modAngle = -Math.PI * 2 + modAngle
  }

  return modAngle
}
