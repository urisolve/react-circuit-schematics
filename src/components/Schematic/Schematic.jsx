import React, { useCallback, useRef } from 'react'
import useDynamicRefs from 'use-dynamic-refs'
import PropTypes from 'prop-types'

import { ElectricalCore } from '../ElectricalCore'
import { Connection } from '../Connection'
import { Node } from '../Node'

import { useSelection } from '../../hooks/useSelection'
import { snapToGrid } from '../../util'

export const Schematic = ({
  schematic,
  width,
  height,
  readOnly,
  gridSize,
  gridColor,
  children,
  ...rest
}) => {
  const [getRef, setRef] = useDynamicRefs()

  const ref = useRef()
  const SelectionArea = useSelection(getRef, schematic.items, ref)

  /**
   * Update the coordinates of a Component.
   *
   * Uses the callback version of the `schematic.editById()` because it must
   * not override the rotation of the element.
   *
   * @param {String} id The id of the element that is dragged.
   * @param {Object} position The new coordinates of the element.
   */
  const handleComponentDragStop = useCallback(
    (id, { x, y }) => {
      schematic.editById(id, (elem) => {
        elem.position = {
          ...elem.position,
          x: snapToGrid(x, gridSize),
          y: snapToGrid(y, gridSize)
        }
        return elem
      })
    },
    [schematic?.editById, gridSize]
  )

  /**
   * Update the coordinates of a Label.
   *
   * Uses the callback version of the `schematic.editById()` because it must
   * not override the rotation of the element.
   *
   * @param {String} id The id of the parent element of the Label.
   * @param {Object} position The new coordinates of the Label.
   */
  const handleLabelDragStop = useCallback(
    (id, { x, y }) => {
      schematic.editById(id, (elem) => {
        elem.label.position = {
          ...elem.label.position,
          x: snapToGrid(x, gridSize),
          y: snapToGrid(y, gridSize)
        }
        return elem
      })
    },
    [schematic?.editById, gridSize]
  )

  return (
    <div
      className='schematic'
      ref={ref}
      style={{
        width,
        height,
        position: 'relative',
        zIndex: 0,

        // Grid
        padding: gridSize,
        backgroundImage: `radial-gradient(
          circle,
          ${gridColor} 1px,
          transparent 1px
          )`,
        backgroundSize: `${gridSize}px ${gridSize}px`
      }}
      {...rest}
    >
      <SelectionArea />
      {children}

      {schematic?.data?.components?.map((comp) => {
        comp.ports.forEach((port) => (port.ref = setRef(port.id)))
        return (
          <ElectricalCore
            {...comp}
            key={comp.id}
            ref={setRef(comp.id)}
            gridSize={gridSize}
            onDragStop={handleComponentDragStop}
            onLabelDragStop={handleLabelDragStop}
            disabled={readOnly}
          />
        )
      })}

      {schematic?.data?.nodes?.map((node) => (
        <Node
          {...node}
          key={node.id}
          ref={setRef(node.id)}
          gridSize={gridSize}
          onDragStop={handleComponentDragStop}
          onLabelDragStop={handleLabelDragStop}
          disabled={readOnly}
        />
      ))}

      {schematic?.data?.connections?.map(
        (conn) =>
          conn.start &&
          conn.end && (
            <Connection
              {...conn}
              key={conn.id}
              ref={setRef(conn.id)}
              start={getRef(conn.start)}
              end={getRef(conn.end)}
              gridSize={gridSize}
              onLabelDragStop={handleLabelDragStop}
              disabled={readOnly}
            />
          )
      )}
    </div>
  )
}

Schematic.propTypes = {
  /**
   * The schematic data
   */
  schematic: PropTypes.object,
  /**
   * The width of the canvas
   */
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * The height of the canvas
   */
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * Flag that enables or disables the dragging/editing ability
   */
  readOnly: PropTypes.bool,
  /**
   * The size of the grid units, in pixels
   */
  gridSize: PropTypes.number,
  /**
   * The color of the grid dots
   */
  gridColor: PropTypes.string
}

Schematic.defaultProps = {
  schematic: {},
  width: '100%',
  height: '100%',
  gridSize: 10,
  gridColor: '#777'
}
