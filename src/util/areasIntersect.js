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
  a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1
