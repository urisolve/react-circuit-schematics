/**
 * Check if the given element is an electrical Component.
 *
 * @param {Object} element A schematic element.
 * @returns Wether or not the element is an electrical component.
 */
export const isComponent = (element) =>
  Object.prototype.hasOwnProperty.call(element, 'ports')

/**
 * Check if the given element is a Connection
 *
 * @param {Object} element A schematic element.
 * @returns Wether or not the element is a Connection.
 */
export const isConnection = (element) =>
  Object.prototype.hasOwnProperty.call(element, 'start') ||
  Object.prototype.hasOwnProperty.call(element, 'end')

/**
 * Check if the given element is a Node.
 *
 * @param {Object} element A schematic element.
 * @returns Wether or not the element is a Node.
 */
export const isNode = (element) =>
  Object.prototype.hasOwnProperty.call(element, 'connections')

/**
 * Check if the given element is a Port.
 *
 * @param {Object} element A schematic element.
 * @returns Wether or not the element is a Port.
 */
export const isPort = (element) =>
  Object.prototype.hasOwnProperty.call(element, 'connection')

/**
 * Check if the given element has a Label.
 *
 * @param {Object} element A schematic element.
 * @returns Wether or not the element has a Label.
 */
export const hasLabel = (element) =>
  Object.prototype.hasOwnProperty.call(element, 'label')
