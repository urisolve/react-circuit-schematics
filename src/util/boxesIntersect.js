/**
 * Check weather or not if two boxes intersect.
 *
 * @param {} a The box to be checked.
 * @param {} b The box to be checked.
 * @returns {Boolean} If the two boxes intersect
 */
export const boxesIntersect = (a, b) =>
  a.left <= b.left + b.width &&
  a.left + a.width >= b.left &&
  a.top <= b.top + b.height &&
  a.top + a.height >= b.top
