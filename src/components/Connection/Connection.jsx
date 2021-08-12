import React, { forwardRef, useMemo } from 'react';
import XArrow from 'react-xarrows';
import PropTypes from 'prop-types';

export const Connection = forwardRef(
  (
    {
      start,
      end,
      type,
      properties,
      gridBreak,
      onClick,
      isSelected,
      isSelecting,
      ...rest
    },
    ref,
  ) => {
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
      <XArrow
        start={start}
        end={end}
        path={type}
        showHead={false}
        gridBreak={gridBreak}
        startAnchor='middle'
        endAnchor='middle'
        divContainerStyle={{
          zIndex: -1,
          opacity: properties.opacity ?? 1,
        }}
        SVGcanvasStyle={selectionStyle}
        divContainerProps={{ ref }} // ! Temporary "fix"
        // SVGcanvasProps={{ ref }}
        // arrowBodyProps={{ ref }}
        passProps={{ onClick }}
        {...rest}
      />
    );
  },
);

Connection.displayName = 'Connection';

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
    PropTypes.shape({ current: PropTypes.elementType }),
  ]).isRequired,
  /**
   * A `ref` to the component where the connection ends
   */
  end: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.elementType }),
  ]).isRequired,
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
      end: PropTypes.string,
    }),
    opacity: PropTypes.number,
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
  onClick: PropTypes.func,
};

Connection.defaultProps = {
  type: 'grid',
  properties: {
    color: '',
    stroke: 2,
    decoration: {},
    opacity: 1,
  },
  gridBreak: 1,
};
