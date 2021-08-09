import React, { forwardRef, useMemo } from 'react'
import PropTypes from 'prop-types'

import styles from './Port.module.css'

export const Port = forwardRef(
  ({ position, bounds, properties, rotation, ...rest }, ref) => {
    const realPos = useMemo(() => {
      // Shift the coordinates to origin
      let x = position.x * 2 - 1
      let y = position.y * 2 - 1

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
      return {
        left: x * bounds.width - properties.radius,
        top: y * bounds.height - properties.radius
      }
    }, [position, rotation, properties?.radius])

    return (
      <div
        className={styles.port}
        style={{
          // The size of the port
          width: properties.radius * 2,
          height: properties.radius * 2,

          // The coloring
          backgroundColor: properties.color,

          // The positioning of the port
          ...realPos
        }}
        {...rest}
      >
        <div ref={ref} className={styles.connectionPoint} />
      </div>
    )
  }
)

Port.propTypes = {
  /**
   * The relative position of the Port. Range between `0` and `1`
   */
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }),
  /**
   * The bounding box of the Port's position
   */
  bounds: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }),
  /**
   * Optional properties of the Port
   */
  properties: PropTypes.shape({
    radius: PropTypes.number,
    color: PropTypes.string
  }),
  /**
   * The rotation of the port, around its parent's bounds
   */
  rotation: PropTypes.number
}

Port.defaultProps = {
  properties: {
    radius: 6,
    color: '#bbb'
  },
  position: { x: 0.5, y: 0.5 },
  bounds: { x: 1, y: 1 },
  rotation: 0
}
