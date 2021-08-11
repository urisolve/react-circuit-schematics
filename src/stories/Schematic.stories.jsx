/* eslint-disable camelcase */
import React, { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { Schematic } from '../components/Schematic'
import { useSchematic } from '../hooks/useSchematic'
import { RLC_Circuit } from './RLC_Circuit'

export default {
  title: 'High Level API/Schematic',
  component: Schematic,
  parameters: {
    docs: {
      description: {
        component:
          'The Schematic component is where you hold all of the electrical components.'
      },
      source: {
        type: 'code'
      }
    }
  }
}

export const Empty = () => <Schematic width={800} height={500} />

export const ReadOnly = () => {
  const { schematic } = useSchematic(RLC_Circuit)
  return <Schematic schematic={schematic} width={800} height={500} readOnly />
}

export const UndoAndRedo = () => {
  const { schematic, history } = useSchematic(RLC_Circuit)

  return (
    <>
      <button onClick={history.undo} disabled={!history.canUndo}>
        Undo
      </button>
      <button onClick={history.redo} disabled={!history.canRedo}>
        Redo
      </button>

      <Schematic schematic={schematic} width={800} height={500} />
    </>
  )
}

export const BuildCircuit = () => {
  const [width, height] = [800, 500]
  const { schematic } = useSchematic()

  // Generator function for random positions
  function* randomPosGenerator(minX, maxX, minY, maxY) {
    const genRandomIntInRange = (min, max) =>
      Math.floor(Math.random() * (max - min + 1) + min)

    while (true)
      yield {
        x: genRandomIntInRange(minX, maxX),
        y: genRandomIntInRange(minY, maxY)
      }
  }

  // Initialization of the generator
  const randomPos = randomPosGenerator(0, width - 100, 0, height - 100)
  const genRandomPos = () => randomPos.next().value

  const addResistor = useCallback(() => {
    schematic.add({
      type: 'Resistor',
      position: genRandomPos(),
      ports: [
        { id: uuidv4(), position: { x: 0, y: 0.5 } },
        { id: uuidv4(), position: { x: 1, y: 0.5 } }
      ]
    })
  }, [schematic.add])

  const addNode = useCallback(() => {
    schematic.add({ position: genRandomPos() })
  }, [schematic.add])

  const addConnection = useCallback(() => {
    const node1 = { id: uuidv4(), position: genRandomPos() }
    const node2 = { id: uuidv4(), position: genRandomPos() }
    const connection = { start: node1.id, end: node2.id }

    schematic.add([node1, node2, connection])
  }, [schematic.add])

  return (
    <>
      <button onClick={addResistor}>Add Component</button>
      <button onClick={addNode}>Add Node</button>
      <button onClick={addConnection}>Add Connection</button>

      <Schematic schematic={schematic} width={800} height={500} />
    </>
  )
}
