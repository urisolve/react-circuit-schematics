/**
 * Check wether or not if two areas overlap.
 *
 * Algorithm inspired in the algorithm found on StackOverflow
 * https://stackoverflow.com/a/306332/11824886
 *
 * @param {Object} a Area a.
 * @param {Object} b Area b.
 * @returns {Boolean} If the two areas overlap
 */
export const areasIntersect = (a, b) =>
  a.left < b.left + b.width &&
  a.left + a.width > b.left &&
  a.top < b.top + b.height &&
  a.top + a.height > b.top
