/**
 * Snaps the given value to the nearest *snap point*
 * of a grid of the given size.
 *
 * @param {Number} value The value to be snapped.
 * @param {Number} gridSize The size of the desired grid.
 * @returns The snapped value.
 */
export const snapToGrid = (value, gridSize) => {
  const mod = value % gridSize
  if (mod < gridSize / 2) return value - mod
  return value + (gridSize - mod)
}
