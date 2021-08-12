import React, { forwardRef, useRef } from 'react';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';

import cx from 'classnames';
import styles from './Node.module.css';

export const Node = forwardRef(
  (
    { id, position, properties, gridSize, updatePosition, isSelected, ...rest },
    ref,
  ) => {
    const draggableRef = useRef();

    return (
      <Draggable
        handle='.node-handle'
        bounds='.schematic'
        position={position}
        nodeRef={draggableRef}
        grid={[gridSize, gridSize]}
        onStop={(e, position) => updatePosition(id, position)}
        {...rest}
      >
        <div
          className={cx(styles.node, 'node-handle')}
          ref={draggableRef}
          style={{
            width: (properties.radius ?? 6) * 2,
            height: (properties.radius ?? 6) * 2,
            opacity: properties.opacity ?? 1,
            backgroundColor: isSelected
              ? '#3475FF'
              : properties.color ?? '#6495ED',
          }}
        >
          <div ref={ref} className={styles.connectionPoint} />
        </div>
      </Draggable>
    );
  },
);

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
    y: PropTypes.number,
  }).isRequired,
  /**
   * The optional properties fo the node
   */
  properties: PropTypes.shape({
    color: PropTypes.string,
    radius: PropTypes.number,
    opacity: PropTypes.number,
  }),
  /**
   * The size of the grid, i.e., the amount of pixels the drag skips
   */
  gridSize: PropTypes.number,
  /**
   * The handler that updates the position of the Node on drag
   */
  onDragStop: PropTypes.func,
};

Node.defaultProps = {
  position: { x: 0, y: 0 },
  properties: { radius: 6, color: '#6495ED', opacity: 1 },
  gridSize: 10,
};
