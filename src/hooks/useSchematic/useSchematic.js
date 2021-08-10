import { useState, useCallback, useMemo, useEffect } from 'react'
import { cloneDeep, compact, find, isEqual, isFunction } from 'lodash'
import { v4 as uuidv4 } from 'uuid'

import { useHistory } from '../useHistory'
import { hasLabel, isComponent, isConnection } from '../../util'

const emptySchematic = { components: [], nodes: [], connections: [] }

/**
 * A React Hook that takes care of the logic required to run a schematic.
 *
 * @param {Object} initialSchematic The initial value of the schematic.
 * @param {Object} options Extra options to define optional behaviour.
 * @returns {Object} Properties and methods that control the schematic.
 */
export const useSchematic = (initialSchematic = {}, maxHistoryLength = 10) => {
  const [schematic, setSchematic] = useState({
    ...emptySchematic,
    ...initialSchematic
  })
  const history = useHistory(setSchematic, maxHistoryLength)

  /**
   * Calculate the number of connections that are connected each node and port.
   */
  useEffect(() => {
    setSchematic((schematic) => {
      // Calculate all node connections
      for (const node of schematic.nodes) {
        node.connections = []
        for (const conn of schematic.connections) {
          if (conn.start === node.id || conn.end === node.id)
            node.connections.push(conn.id)
        }
      }

      // Calculate all port connections
      for (const component of schematic.components) {
        for (const port of component.ports) {
          port.connection = null
          for (const conn of schematic.connections) {
            if (conn.start === port.id || conn.end === port.id)
              port.connection = conn.id
          }
        }
      }

      return schematic
    })
  }, [setSchematic, schematic])

  /**
   * Array of all the schematic's items.
   */
  const items = useMemo(
    () => [
      ...schematic.components,
      ...schematic.nodes,
      ...schematic.connections
    ],
    [schematic]
  )

  /**
   * Array of all the schematic's labels.
   */
  const labels = useMemo(
    () =>
      compact(
        items.map((item) =>
          hasLabel(item)
            ? { ...item.label, id: uuidv4(), owner: item.id }
            : null
        )
      ),
    [schematic]
  )

  /**
   * Save previous schematic history
   */
  const history = useHistory(setSchematic, maxHistoryLength)

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
        const newSchematic = cloneDeep(oldSchematic)

        // Force element into array format
        if (!(elements instanceof Array)) elements = [elements]

        // Add all given elements to the schematic
        for (const element of elements) {
          // Where should the element be added?
          const where = isComponent(element)
            ? 'components'
            : isConnection(element)
            ? 'connections'
            : 'nodes'

          // Add the new element to the schematic
          newSchematic[where].push({ id: uuidv4(), ...element })
        }

        // If the changes are valid, save the old schematic
        if (!isEqual(oldSchematic, newSchematic)) history.save(oldSchematic)

        return newSchematic
      })
    },
    [setSchematic]
  )

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
    (id) => {
      useSchematic((oldSchematic) => {
        // Make a clone of the current schematic
        const newSchematic = cloneDeep(oldSchematic)

        // Delete the element
        for (const type in newSchematic)
          newSchematic[type] = newSchematic[type].filter(
            (elem) => elem.id !== id
          )

        // TODO: Make the connections stay in the same place
        console.error('Make the connections stay in the same place')

        // If the changes are valid, save the old schematic
        if (!isEqual(oldSchematic, newSchematic)) history.save(oldSchematic)

        return newSchematic
      })
    },
    [setSchematic]
  )

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
    (id, edits, saveChanges = true) => {
      setSchematic((oldSchematic) => {
        // Make a clone of the current schematic
        const newSchematic = cloneDeep(oldSchematic)

        // Apply the edits
        for (const type in newSchematic) {
          newSchematic[type] = newSchematic[type].map((elem) => {
            if (elem.id !== id) return elem
            return isFunction(edits) ? edits(elem) : { ...elem, ...edits }
          })
        }

        // If the changes are valid, save the old schematic
        if (saveChanges && !isEqual(oldSchematic, newSchematic))
          history.save(oldSchematic)

        return newSchematic
      })
    },
    [setSchematic]
  )

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
      editById
    },

    history
  }
}
