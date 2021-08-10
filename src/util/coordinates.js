/**
 * Rotate the given coordinates by a given amount.
 *
 * 1. Converts the coordinates into the polar format.
 * 2. Applies the rotation.
 * 3. Converts back to Cartesian format.
 *
 * @param {Object} position The original coordinates (0 to 1 scale).
 * @param {Number} rotation The amount to rotate, in degrees.
 * @returns The rotated coordinates.
 */
export const rotateCoords = ({ x, y }, rotation = 0) => {
  // Shift the coordinates to origin
  x = x * 2 - 1
  y = y * 2 - 1

  // Convert to polar coordinates
  const radius = Math.sqrt(x * x + y * y)
  let teta = Math.atan2(y, x)

  // Apply the rotation
  teta += rotation * (Math.PI / 180)

  // Convert back to Cartesian coordinates
  x = radius * Math.cos(teta)
  y = radius * Math.sin(teta)

  // Shift the coordinates back
  x = (x + 1) / 2
  y = (y + 1) / 2

  // Scale the position to fit the bounds
  return { x, y }
}
