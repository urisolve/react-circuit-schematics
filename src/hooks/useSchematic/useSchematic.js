import { useState, useCallback, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useDynamicRefs from 'use-dynamic-refs';
import lodash from 'lodash';

import {
  hasLabel,
  isComponent,
  isConnection,
  isNode,
  isPort,
  rotateCoords,
  snapPosToGrid,
} from '../../util';
import { useHistory } from '../useHistory';

const emptySchematic = { components: [], nodes: [], connections: [] };
const defaultOptions = { maxHistoryLength: 10, gridSize: 10 };

/**
 * A React Hook that takes care of the logic required to run a schematic.
 *
 * @param {Object} initialSchematic The initial value of the schematic.
 * @param {Object} options Extra options to define optional behaviour.
 * @returns {Object} Properties and methods that control the schematic.
 */
export const useSchematic = (initialSchematic = {}, options = {}) => {
  initialSchematic = { ...emptySchematic, ...initialSchematic };
  options = { ...defaultOptions, ...options };

  const [getRef] = useDynamicRefs();
  const [schematic, setSchematic] = useState(initialSchematic);

  // Extra logic
  const [selectingItems, setSelectingItems] = useState(new Set());
  const [selectedItems, setSelectedItems] = useState(new Set());
  const history = useHistory(setSchematic, options.maxHistoryLength);

  /**
   * Calculate each Node and Port's connections.
   */
  useEffect(() => {
    setSchematic((schematic) => {
      // Calculate all node connections and type
      for (const node of schematic.nodes) {
        node.connections = [];
        for (const conn of schematic.connections)
          if (conn.start === node.id || conn.end === node.id)
            node.connections.push(conn.id);
        node.type = node.connections.length > 2 ? 'real' : 'virtual';
      }

      // Calculate all port connections
      for (const component of schematic.components) {
        for (const port of component.ports) {
          port.connection = null;
          for (const conn of schematic.connections)
            if (conn.start === port.id || conn.end === port.id)
              port.connection = conn.id;
        }
      }

      return schematic;
    });
  }, [setSchematic, schematic]);

  /**
   * Array of all the schematic's items.
   */
  const items = useMemo(
    () => [
      ...schematic.components,
      ...schematic.nodes,
      ...schematic.connections,
    ],
    [schematic],
  );

  /**
   * Array of all the schematic's labels.
   */
  const labels = useMemo(
    () =>
      lodash.compact(
        items.map((item) =>
          hasLabel(item)
            ? { ...item.label, id: uuidv4(), owner: item.id }
            : null,
        ),
      ),
    [items],
  );

  /**
   * Take care of connections
   */
  useEffect(() => {
    setSchematic((schematic) => {
      // Map of (position string) -> (element id)
      const seenPositions = new Map();

      // Build hash map of all ports positions
      for (const component of schematic.components) {
        for (const port of component.ports) {
          // Calculate component's width and height
          const compRef = getRef(component.id).current;
          const { width, height } = compRef.getBoundingClientRect();

          // Calculate port's real position
          const rotatedCoords = rotateCoords(
            port.position,
            component.position.angle,
          );
          const realPos = {
            x: component.position.x + rotatedCoords.x * width,
            y: component.position.y + rotatedCoords.y * height,
          };

          // Add it to the hash map
          const positionString = JSON.stringify(realPos);
          seenPositions.set(positionString, port.id);
        }
      }

      // Check if nodes overlay ports or other nodes
      for (const node of schematic.nodes) {
        const positionString = JSON.stringify(node.position);

        // If the node doesn't overlay any of the already seen ones,
        if (seenPositions.has(positionString)) {
          // Calculate what is being overlaid
          const pattern = { id: seenPositions.get(positionString) };
          const overlaidElem =
            lodash.find(items, pattern) ??
            lodash.find(
              lodash.find(items, { ports: [pattern] }).ports,
              pattern,
            );

          // If the port is already connected, do nothing
          if (isPort(overlaidElem) && overlaidElem.connection) return schematic;

          // Move connections from that node to the overlaid element
          for (const conn of schematic.connections) {
            if (conn.start === node.id) conn.start = overlaidElem.id;
            if (conn.end === node.id) conn.end = overlaidElem.id;
          }

          // Delete the useless node
          schematic.nodes = schematic.nodes.filter((n) => n.id !== node.id);
        }

        // Mark position as seen
        else seenPositions.set(positionString, node.id);
      }

      return schematic;
    });
  }, [setSchematic, schematic, items, getRef]);

  /**
   * Adds an element to the schematic.
   *
   * Automatically detects if it is a Component, Node or Connection
   * by it's properties.
   *
   * @param {Object} element The element to be added.
   */
  const add = useCallback(
    (elements) => {
      setSchematic((oldSchematic) => {
        // Make a clone of the current schematic
        const newSchematic = lodash.cloneDeep(oldSchematic);

        // Force element into array format
        if (!(elements instanceof Array)) elements = [elements];

        // Add all of the given elements to the schematic
        for (const element of elements) {
          // Lock the element's position to the grid
          if (!isConnection(element)) {
            element.position = snapPosToGrid(
              element.position,
              options.gridSize,
            );
          }

          // Add the new element to the schematic
          let where = 'nodes';
          if (isComponent(element)) where = 'components';
          else if (isConnection(element)) where = 'connections';
          newSchematic[where].push({ id: uuidv4(), ...element });
        }

        // If the changes are valid, save the old schematic
        if (!lodash.isEqual(oldSchematic, newSchematic))
          history.save(oldSchematic);

        return newSchematic;
      });
    },
    [setSchematic, history, options.gridSize],
  );

  /**
   * Deletes an element from the schematic.
   *
   * Searches for the element that has the given id, and removes it from the
   * schematic. Note that if multiple elements share the same id, they will all
   * be deleted.
   *
   * @param {String} id The id of the element to be deleted.
   */
  const deleteById = useCallback(
    (ids) => {
      setSchematic((oldSchematic) => {
        // Make a clone of the current schematic
        const newSchematic = lodash.cloneDeep(oldSchematic);

        // Force ids into array format
        if (!(ids instanceof Array)) ids = [ids];

        // Delete each of the corresponding elements
        for (const id of ids) {
          for (const type in newSchematic) {
            // Find the element
            const elem = lodash.find(newSchematic[type], { id });

            // Remove all connections if the element is a node
            if (isNode(elem ?? {})) {
              newSchematic.connections.filter(
                (conn) => conn.start !== id && conn.end !== id,
              );
            }

            // Remove all connections to the ports of the component
            else if (isComponent(elem ?? {})) {
              for (const port of elem.ports) {
                newSchematic.connections = lodash.reject(
                  newSchematic.connections,
                  { id: port.connection },
                );
              }
            }

            // Delete the element with the given id
            newSchematic[type] = newSchematic[type].filter(
              (elem) => elem.id !== id,
            );
          }
        }

        // If the changes are valid, save the old schematic
        if (!lodash.isEqual(oldSchematic, newSchematic))
          history.save(oldSchematic);

        return newSchematic;
      });
    },
    [setSchematic, history],
  );

  /**
   * Applies certain edits to the specified element.
   *
   * Searches for the element that has the given id, and applies the given
   * edits. Note that if multiple elements share the same id, they will all
   * be edited. The edits can be directly passed and added to the element, but,
   * if a more complex edit is required, you can pass a callback to be applied
   * to the element.
   *
   * @param {String} id The id of the element to be edited.
   * @param {any} edits If it's a function, apply it to the correct element.
   * Otherwise, apply the given edits (Object) to the state.
   * @param {Boolean} If If it should save the changes to the history.
   */
  const editById = useCallback(
    (ids, edits, saveChanges = true) => {
      setSchematic((oldSchematic) => {
        // Make a clone of the current schematic
        const newSchematic = lodash.cloneDeep(oldSchematic);

        // Force ids into array format
        if (!(ids instanceof Array)) ids = [ids];

        // Apply the edits
        for (const id of ids) {
          for (const type in newSchematic) {
            newSchematic[type] = newSchematic[type].map((elem) => {
              if (elem.id !== id) return elem;
              return lodash.isFunction(edits)
                ? edits(elem)
                : { ...elem, ...edits };
            });
          }
        }

        // If the changes are valid, save the old schematic
        if (saveChanges && !lodash.isEqual(oldSchematic, newSchematic))
          history.save(oldSchematic);

        return newSchematic;
      });
    },
    [setSchematic, history],
  );

  /**
   * Return the relevant data to the user.
   */
  return {
    schematic: {
      data: schematic,
      items,
      labels,

      add,
      deleteById,
      editById,
    },

    selection: {
      selectingItems,
      selectedItems,
      setSelectingItems,
      setSelectedItems,
    },

    history,
  };
};
