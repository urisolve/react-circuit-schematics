import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useReducer
} from 'react'
import useDynamicRefs from 'use-dynamic-refs'
import PropTypes from 'prop-types'

import { SelectionArea } from '../SelectionArea'
import { ElectricalCore } from '../ElectricalCore'
import { Connection } from '../Connection'
import { Node } from '../Node'
import { Label } from '../Label'

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
  const canvasRef = useRef()

  const [selectingItems, setSelectingItems] = useState(new Set())
  const [selectedItems, setSelectedItems] = useState(new Set())

  // Work-around for react-xarrows updating the connection.
  const [, reRender] = useReducer(() => ({}), {})
  const renderCount = useRef(0)
  useEffect(() => {
    renderCount.current += 1
    if (renderCount.current === 2) {
      reRender()
      renderCount.current = 0
    }
  })

  /**
   * Update the coordinates of a Component.
   *
   * @param {String} id The id of the element that is dragged.
   * @param {Object} position The new coordinates of the element.
   * @param {Boolean} isLabel If you want to update the label's coordinates
   */
  const updatePosition = useCallback(
    (id, { x, y }, isLabel = false) => {
      // Snap the values to the grid
      x = snapToGrid(x, gridSize)
      y = snapToGrid(y, gridSize)

      // Apply the new position
      schematic.editById(id, (elem) => {
        const positionObject = isLabel ? elem.label.position : elem.position
        positionObject.x = x
        positionObject.y = y
        return elem
      })
    },
    [schematic?.editById, gridSize]
  )

  return (
    <div
      className='schematic'
      ref={canvasRef}
      style={{
        width,
        height,
        position: 'relative',
        zIndex: 0,

        // Grid
        backgroundImage: `radial-gradient(
          circle,
          ${gridColor} 1px,
          transparent 1px
          )`,
        backgroundSize: `${gridSize}px ${gridSize}px`
      }}
      {...rest}
    >
      {children}

      <SelectionArea
        getRef={getRef}
        parentRef={canvasRef}
        ignoreItems={schematic.labels}
        selectableItems={schematic.items}
        selectingItems={selectingItems}
        setSelectingItems={setSelectingItems}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        disabled={readOnly}
      />

      {schematic?.data?.components?.map((comp) => {
        comp.ports.forEach((port) => (port.ref = setRef(port.id)))
        return (
          <ElectricalCore
            {...comp}
            key={comp.id}
            ref={setRef(comp.id)}
            gridSize={gridSize}
            updatePosition={updatePosition}
            onDrag={reRender}
            isSelected={selectedItems.has(comp.id)}
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
          updatePosition={updatePosition}
          onDrag={reRender}
          isSelected={selectedItems.has(node.id)}
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
              updatePosition={updatePosition}
              isSelected={selectedItems.has(conn.id)}
              disabled={readOnly}
            />
          )
      )}

      {schematic?.labels?.map((label) => (
        <Label
          {...label}
          key={label.id}
          ref={setRef(label.id)}
          updatePosition={updatePosition}
          disabled={readOnly}
        />
      ))}
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
