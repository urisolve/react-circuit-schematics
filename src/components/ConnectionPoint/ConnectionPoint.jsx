import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'

export const ConnectionPoint = forwardRef(({ position, ...rest }, ref) => (
  <div
    ref={ref}
    style={{
      position: 'relative',
      left: position.x,
      top: position.y
    }}
    {...rest}
  />
))

ConnectionPoint.propTypes = {
  /**
   * The position of the point
   */
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  })
}

ConnectionPoint.defaultProps = {
  position: { x: '50%', y: '50%' }
}
