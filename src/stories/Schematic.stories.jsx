/* eslint-disable camelcase */
import React from 'react'

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

export const JSON_FormatExample = () => {
  const circuit = {
    components: [
      {
        id: '8c0168ec-07fe-4b2c-96ee-4292ab34cfb2',
        type: 'DC Voltage Source',
        position: { x: 200, y: 150 },
        label: {
          name: 'U',
          value: '5',
          unit: 'V',
          position: { x: 270, y: 220 }
        },
        ports: [
          {
            id: '7ed2507f-14fe-45e2-9246-9ee1d36eb442',
            type: 'hybrid',
            position: { x: 0.5, y: 0 }
          },
          {
            id: 'c990e78e-2bc5-4afb-92ee-b8a6d1faab0f',
            type: 'hybrid',
            position: { x: 0.5, y: 1 }
          }
        ]
      },
      {
        id: 'a2475d77-22a6-47b5-b60b-04aa5af69284',
        type: 'Resistor',
        position: { x: 400, y: 200, angle: 90 },
        label: {
          name: 'R',
          value: '10k',
          unit: 'Ω',
          position: { x: 480, y: 240 }
        },
        ports: [
          {
            id: 'ddd6efab-f8f2-4565-8010-1270556f1d00',
            type: 'hybrid',
            position: { x: 0, y: 0.5 }
          },
          {
            id: '1f7b8784-184b-4733-ae81-53c74b62462c',
            type: 'hybrid',
            position: { x: 1, y: 0.5 }
          }
        ]
      }
    ],
    nodes: [],
    connections: [
      {
        id: 'fd313c9d-03f2-437d-8462-331e4efc660a',
        start: '7ed2507f-14fe-45e2-9246-9ee1d36eb442',
        end: 'ddd6efab-f8f2-4565-8010-1270556f1d00'
      },
      {
        id: 'da7214da-14c6-49ab-9ca6-5b2ed8a184d3',
        start: '1f7b8784-184b-4733-ae81-53c74b62462c',
        end: 'c990e78e-2bc5-4afb-92ee-b8a6d1faab0f'
      }
    ]
  }

  const { schematic } = useSchematic(circuit)
  return <Schematic schematic={schematic} width={800} height={500} />
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

export const ReadOnly = () => {
  const { schematic } = useSchematic(RLC_Circuit)
  return <Schematic schematic={schematic} width={800} height={500} readOnly />
}
