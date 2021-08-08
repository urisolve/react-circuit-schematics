/**
 * Check wether or not if two areas overlap.
 * You can check if a point is inside an area by setting the point's width and
 * height to 0 (or any falsy value).
 *
 * @param {Object} a Area a.
 * @param {Object} b Area b.
 * @returns {Boolean} If the two areas overlap
 */
export const areasIntersect = (a, b) =>
  a.left < b.left + (b.width ?? 0) &&
  a.left + (a.width ?? 0) > b.left &&
  a.top < b.top + (b.height ?? 0) &&
  a.top + (a.height ?? 0) > b.top
