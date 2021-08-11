/**
 * Generates a random number in the given range.
 *
 * @param {Number} min The minimum possible value.
 * @param {Number} max The maximum possible value.
 * @returns The randomly generated number.
 */
const genRandomInRange = (min, max) => Math.random() * (max - min + 1) + min

/**
 * Generates a randomly position within a component.
 *
 * @param {Number} width The width of the component.
 * @param {Number} height The height of the component.
 * @returns The randomly generated position.
 */
export const genRandomPos = (width, height) => ({
  x: genRandomInRange(0, width),
  y: genRandomInRange(0, height)
})
