import React, { forwardRef } from 'react'
import XArrow from 'react-xarrows'
import PropTypes from 'prop-types'

import { Label } from '../Label'

export const Connection = forwardRef(
  (
    {
      id,
      start,
      end,
      label,
      type,
      properties,
      gridSize,
      gridBreak,
      onClick,
      onDragStop,
      ...rest
    },
    ref
  ) => {
    return (
      <div ref={ref}>
        <XArrow
          start={start}
          end={end}
          path={type}
          showHead={false}
          gridBreak={gridBreak + '%'}
          zIndex={-1}
          divContainerStyle={{ opacity: properties.opacity ?? 1 }}
          passProps={{ onClick }}
          {...rest}
        />
        {label && (
          <Label
            gridSize={gridSize}
            onDragStop={(e, position) => onDragStop(id, position, true)}
            {...rest}
            {...label}
          />
        )}
      </div>
    )
  }
)

Connection.propTypes = {
  /**
   * The unique id of the connection
   */
  id: PropTypes.string,
  /**
   * A `ref` to the component where the connection starts
   */
  start: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.elementType })
  ]).isRequired,
  /**
   * A `ref` to the component where the connection ends
   */
  end: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.elementType })
  ]).isRequired,
  /**
   * The label of the connection
   */
  label: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.number,
    unit: PropTypes.string,
    position: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    })
  }),
  /**
   * The type of path the connection takes
   */
  type: PropTypes.oneOf(['grid', 'smooth', 'straight']),
  /**
   * Optional properties of the connection
   */
  properties: PropTypes.shape({
    color: PropTypes.string,
    stroke: PropTypes.number,
    decoration: PropTypes.shape({
      start: PropTypes.string,
      end: PropTypes.string
    }),
    opacity: PropTypes.number
  }),
  /**
   * The size of the grid the Label should move in
   */
  gridSize: PropTypes.number,
  /**
   * Where the connection should have a 90deg turn, in percentage
   */
  gridBreak: PropTypes.number,
  /**
   * The callback to execute when clicking on the connection
   */
  onClick: PropTypes.func
}

Connection.defaultProps = {
  type: 'grid',
  properties: {
    color: '',
    stroke: 2,
    decoration: {},
    opacity: 1
  },
  gridBreak: 100
}
