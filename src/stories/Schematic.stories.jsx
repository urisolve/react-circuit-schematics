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

export const AddConnections = () => {
  const noConnection = lodash.omit(RLC_Circuit, 'connections')
  const { schematic } = useSchematic(noConnection)

  const addConnection = useCallback(() => {
    const node1 = { id: uuidv4(), position: { x: 100, y: 100 } }
    const node2 = { id: uuidv4(), position: { x: 400, y: 400 } }
    const connection = { start: node1.id, end: node2.id }

    schematic.add([node1, node2, connection])
  }, [schematic.add])

  return (
    <>
      <button onClick={addConnection}>Add Connection</button>

      <Schematic schematic={schematic} width={800} height={500} />
    </>
  )
}
