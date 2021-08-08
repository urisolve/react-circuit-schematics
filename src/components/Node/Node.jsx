import React, { forwardRef, useRef } from 'react'
import Draggable from 'react-draggable'
import { useXarrow } from 'react-xarrows'
import { PropTypes } from 'prop-types'

import cx from 'classnames'
import styles from './Node.module.css'

import { Label } from '../Label'

export const Node = forwardRef(
  ({ id, position, label, properties, gridSize, onDragStop, ...rest }, ref) => {
    const draggableRef = useRef()
    const updateXarrow = useXarrow()

    return (
      <Draggable
        handle='.node-handle'
        bounds='.schematic'
        position={position}
        nodeRef={draggableRef}
        grid={[gridSize, gridSize]}
        onDrag={updateXarrow}
        onStop={(e, position) => onDragStop(id, position)}
        {...rest}
      >
        <div ref={draggableRef}>
          <div
            className={cx(styles.node, 'node-handle')}
            style={{
              width: (properties.radius ?? 6) * 2,
              height: (properties.radius ?? 6) * 2,
              backgroundColor: properties.color ?? '#6495ED',
              opacity: properties.opacity ?? 1
            }}
          >
            <div ref={ref} />
          </div>

          {label && (
            <Label
              gridSize={gridSize}
              onDragStop={(e, position) => onDragStop(id, position, true)}
              // disabled={disabled}
              {...rest}
              {...label}
            />
          )}
        </div>
      </Draggable>
    )
  }
)

Node.propTypes = {
  /**
   * The unique id of the node
   */
  id: PropTypes.string,
  /**
   * The position of the node
   */
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }).isRequired,
  /**
   * The label of the node
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
   * The optional properties fo the node
   */
  properties: PropTypes.shape({
    color: PropTypes.string,
    radius: PropTypes.number,
    opacity: PropTypes.number
  }),
  /**
   * The size of the grid, i.e., the amount of pixels the drag skips
   */
  gridSize: PropTypes.number,
  /**
   * The handler that updates the position of the Node on drag
   */
  onDragStop: PropTypes.func
}

Node.defaultProps = {
  position: { x: 0, y: 0 },
  properties: { radius: 6, color: '#6495ED', opacity: 1 },
  gridSize: 10
}
