import React, { useCallback, useRef, useEffect, useReducer } from 'react';
import useDynamicRefs from 'use-dynamic-refs';
import PropTypes from 'prop-types';

import { SelectionArea } from '../SelectionArea';
import { ElectricalCore } from '../ElectricalCore';
import { Connection } from '../Connection';
import { Node } from '../Node';
import { Label } from '../Label';

import { snapValueToGrid } from '../../util';

export const Schematic = ({
  schematic,
  selection,
  width,
  height,
  readOnly,
  gridSize,
  gridColor,
  style,
  children,
  ...rest
}) => {
  const [getRef, setRef] = useDynamicRefs();
  const canvasRef = useRef();

  // Work-around for react-xarrows updating the connection.
  const [, reRender] = useReducer(() => ({}), {});
  const renderCount = useRef(0);
  useEffect(() => {
    renderCount.current += 1;
    if (renderCount.current === 2) {
      reRender();
      renderCount.current = 0;
    }
  });

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
      x = snapValueToGrid(x, gridSize);
      y = snapValueToGrid(y, gridSize);

      // Apply the new position
      schematic.editById(id, (elem) => {
        const positionObject = isLabel ? elem.label.position : elem.position;
        positionObject.x = x;
        positionObject.y = y;
        return elem;
      });
    },
    [schematic, gridSize],
  );

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
        backgroundSize: `${gridSize}px ${gridSize}px`,

        // Shadow
        border: '1px solid #eee',
        boxShadow: '0px 0px 8px #eee',

        // Custom Style
        ...style,
      }}
      {...rest}
    >
      {children}

      <SelectionArea
        getRef={getRef}
        parentRef={canvasRef}
        ignoreItems={schematic.labels}
        selectableItems={schematic.items}
        setSelectingItems={selection?.setSelectingItems}
        setSelectedItems={selection?.setSelectedItems}
        disabled={readOnly}
      />

      {schematic?.data?.components?.map((comp) => {
        comp.ports.forEach((port) => (port.ref = setRef(port.id)));
        return (
          <ElectricalCore
            {...comp}
            key={comp.id}
            ref={setRef(comp.id)}
            gridSize={gridSize}
            updatePosition={updatePosition}
            onDrag={reRender}
            isSelected={selection?.selectedItems.has(comp.id)}
            isSelecting={selection?.selectingItems.has(comp.id)}
            disabled={readOnly}
          />
        );
      })}

      {schematic?.data?.nodes?.map((node) => (
        <Node
          {...node}
          key={node.id}
          ref={setRef(node.id)}
          gridSize={gridSize}
          updatePosition={updatePosition}
          onDrag={reRender}
          isSelected={selection?.selectedItems.has(node.id)}
          isSelecting={selection?.selectingItems.has(node.id)}
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
              isSelected={selection?.selectedItems.has(conn.id)}
              isSelecting={selection?.selectingItems.has(conn.id)}
              disabled={readOnly}
            />
          ),
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
  );
};

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
  gridColor: PropTypes.string,
};

Schematic.defaultProps = {
  schematic: {},
  width: '100%',
  height: '100%',
  readOnly: false,
  gridSize: 10,
  gridColor: '#777',
};
