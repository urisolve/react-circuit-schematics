import React, { useRef, useState, useEffect, useMemo, forwardRef } from 'react'
import useDynamicRefs from 'use-dynamic-refs'
import Draggable from 'react-draggable'
import PropTypes from 'prop-types'

import styles from './ElectricalCore.module.css'
import cx from 'classnames'

import { svgMap } from '../../../assets'
import { Port } from '../Port'
import { Label } from '../Label'

export const ElectricalCore = forwardRef(
  (
    {
      id,
      type,
      position,
      label,
      ports,
      width,
      height,
      gridSize,
      altImageIdx,
      imgPath,
      handlePortClick,
      onDragStop,
      onLabelDragStop,
      onClick,
      isSelected,
      ...rest
    },
    ref
  ) => {
    const [getRef] = useDynamicRefs()
    const draggableRef = useRef()

    const boundingRef = useRef()
    const [bounds, setBounds] = useState({ x: 0, y: 0 })
    const [renderCount, setRenderCount] = useState(0)

    /**
     * Calculate which SVG to use.
     *
     * If a custom image is provided, then it uses that one.
     * Otherwise, if it was provided an alternate image index, use that.
     * Otherwise, use the default one.
     */
    const src = useMemo(() => {
      // If there is a custom image, use that one
      if (imgPath) return imgPath

      // Otherwise, grab the correct SVG
      const src = svgMap.get(type)
      return Array.isArray(src) ? src[altImageIdx ?? 0] : src
    }, [altImageIdx])

    /**
     * Calculate the bounds of the component.
     * Force re-renders until the bounds are properly calculated.
     */
    useEffect(() => {
      // Calculate the bounds of the component's image
      const newBounds = {
        x: boundingRef.current?.offsetWidth,
        y: boundingRef.current?.offsetHeight
      }

      // Update the bounds or force re-render
      if (newBounds.x && newBounds.y) setBounds(newBounds)
      else setRenderCount(renderCount + 1)
    }, [boundingRef, renderCount])

    return (
      <Draggable
        handle='.component-handle'
        bounds='.schematic'
        nodeRef={draggableRef}
        position={position}
        positionOffset={{ x: 5, y: 5 }}
        grid={[gridSize, gridSize]}
        onStop={(e, position) => onDragStop(id, position)}
        {...rest}
      >
        <div className={styles.wrapper} ref={draggableRef}>
          <div ref={ref}>
            <img
              className={cx(styles.noDrag, 'component-handle')}
              style={{
                transform: `rotate(${position?.angle ?? 0}deg)`,
              width: width,
              height: height,

              // Selection
              filter: isSelected && `drop-shadow(3px 2px ${0}px ${'#888'})`,
              WebkitFilter:
                isSelected && `drop-shadow(3px 2px ${0}px ${'#888'})`
            }}
            onClick={onClick}
              ref={boundingRef}
              src={src}
              alt={type}
            />
          </div>

          {ports.map((port) => {
            return (
              <Port
                key={port.id}
                ref={getRef(port.id)}
                bounds={{ width, height }}
                onClick={() => handlePortClick?.(port.id)}
                rotation={position?.angle}
                {...rest}
                {...port}
              />
            )
          })}

          {label && (
            <Label
              gridSize={gridSize}
              onDragStop={(e, position) => onLabelDragStop(id, position)}
              {...rest}
              {...label}
            />
          )}
        </div>
      </Draggable>
    )
  }
)

ElectricalCore.propTypes = {
  /**
   * The unique id of the component
   */
  id: PropTypes.string,
  /**
   * The type of the component
   */
  type: PropTypes.string.isRequired,
  /**
   * The position of the component
   */
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
    angle: PropTypes.number
  }),
  /**
   * The label of the component
   */
  label: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
    unit: PropTypes.string,
    position: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    })
  }),
  /**
   * An array of the connection ports
   */
  ports: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string,
      position: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
      }),
      ref: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.any })
      ])
    })
  ),
  /**
   * The width of the component, in pixels
   */
  width: PropTypes.number,
  /**
   * The height of the component, in pixels
   */
  height: PropTypes.number,
  /**
   * The size of the grid, i.e., the amount of pixels the drag skips
   */
  gridSize: PropTypes.number,
  /**
   * Index of the alternate images. If `0` then use default image
   */
  altImageIdx: PropTypes.number,
  /**
   * The source path to a custom image to be used by the component
   */
  imgPath: PropTypes.string
}

ElectricalCore.defaultProps = {
  position: { x: 0, y: 0 },
  width: 100,
  height: 100,
  gridSize: 10,
  altImageIdx: 0
}
