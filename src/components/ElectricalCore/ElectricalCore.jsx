import React, { useRef, useMemo, forwardRef } from 'react';
import useDynamicRefs from 'use-dynamic-refs';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';

import styles from './ElectricalCore.module.css';
import cx from 'classnames';

import { svgMap } from '../../../assets';
import { Port } from '../Port';

export const ElectricalCore = forwardRef(
  (
    {
      id,
      type,
      position,
      ports,
      width,
      height,
      gridSize,
      altImageIdx,
      imgPath,
      updatePosition,
      isSelected,
      isSelecting,
      ...rest
    },
    ref,
  ) => {
    const [getRef] = useDynamicRefs();
    const draggableRef = useRef();

    /**
     * Calculate which SVG to use.
     *
     * If a custom image is provided, then it uses that one.
     * Otherwise, if it was provided an alternate image index, use that.
     * Otherwise, use the default one.
     */
    const src = useMemo(() => {
      // If there is a custom image, use that one
      if (imgPath) return imgPath;

      // Otherwise, grab the correct SVG
      const src = svgMap.get(type);
      return Array.isArray(src) ? src[altImageIdx ?? 0] : src;
    }, [altImageIdx, imgPath, type]);

    /**
     * Calculate the style that controls the rotation of the image
     */
    const rotationStyle = useMemo(() => {
      const rotationString = `rotate(${position?.angle ?? 0}deg)`;
      return {
        transform: rotationString,
        WebkitTransform: rotationString,
        msTransform: rotationString,
      };
    }, [position.angle]);

    const selectionStyle = useMemo(() => {
      const selectionColor = '#888';
      const blurAmount = 0;
      const displacement = { x: 3, y: 2 };

      const dropShadow = `drop-shadow(${displacement.x}px ${displacement.y}px ${blurAmount}px ${selectionColor})`;

      return {
        filter: (isSelected || isSelecting) && dropShadow,
        WebkitFilter: (isSelected || isSelecting) && dropShadow,
      };
    }, [isSelected, isSelecting]);

    return (
      <Draggable
        handle='.component-handle'
        bounds='.schematic'
        nodeRef={draggableRef}
        position={position}
        positionOffset={{ x: 5, y: 5 }}
        grid={[gridSize, gridSize]}
        onStop={(e, position) => updatePosition?.(id, position)}
        {...rest}
      >
        <div className={styles.wrapper} ref={draggableRef}>
          <img
            style={{
              width: width,
              height: height,
              ...rotationStyle,
              ...selectionStyle,
            }}
            className={cx(styles.noDrag, 'component-handle')}
            ref={ref}
            src={src}
            alt={type}
          />

          {ports.map((port) => {
            return (
              <Port
                key={port.id}
                ref={getRef(port.id)}
                bounds={{ width, height }}
                rotation={position?.angle}
                {...rest}
                {...port}
              />
            );
          })}
        </div>
      </Draggable>
    );
  },
);

ElectricalCore.displayName = 'ElectricalCore';

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
    angle: PropTypes.number,
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
        y: PropTypes.number,
      }),
      ref: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.any }),
      ]),
    }),
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
  imgPath: PropTypes.string,
};

ElectricalCore.defaultProps = {
  position: { x: 0, y: 0 },
  width: 100,
  height: 100,
  gridSize: 10,
  altImageIdx: 0,
};
