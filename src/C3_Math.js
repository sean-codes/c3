import { C3_Vector } from './C3_Vector.js'

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
  return new C3_Vector(
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
 * @param {number} angle1
 * @param {number} angle2
 * @return {number} the angle from a vector
 */
export function angleVec(x, y) {
   return loopAngle(Math.atan2(x + 0, y + 0))
}

/**
 * Gets the angle between two angles
 * @param {number} angle1
 * @param {number} angle2
 */
export function angleBetween(a1, a2) {
  const angleDiff = angleToAngle(a1, a2)
  return a1 + angleDiff / 2
}

/**
 * Finds the smallest angle to get from 1 -> 2
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

export function radian(degree) {
  return degree * (Math.PI/180)
}

export function degree(radian) {
  return (radian / Math.PI) * 180
}

export function round(number, size) {
  return Math.round(number * size) / size
}