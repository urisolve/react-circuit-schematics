import React, { useRef } from 'react'

import { Schematic } from '../../components/Schematic'
import { Connection } from '../../components/Connection'
import { Node } from '../../components/Node'

export default {
  title: 'Low Level/Connection',
  component: Connection,
  argTypes: {
    start: { control: '' },
    end: { control: '' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'The Connection component allows the user to connect Ports and Nodes.'
      },
      source: {
        type: 'code'
      }
    }
  }
}

export const Simple = () => {
  const start = useRef()
  const end = useRef()

  return (
    <Schematic height={120} width={220}>
      <Node ref={start} position={{ x: 10, y: 10 }} />
      <Node ref={end} position={{ x: 200, y: 100 }} />

      <Connection start={start} end={end} />
    </Schematic>
  )
}

export const Labeled = () => {
  const start = useRef()
  const end = useRef()

  return (
    <Schematic height={100} width={220}>
      <Node ref={start} position={{ x: 20, y: 50 }} />
      <Node ref={end} position={{ x: 200, y: 50 }} />

      <Connection
        start={start}
        end={end}
        label={{ name: 'Hello', position: { x: 100, y: 30 } }}
      />
    </Schematic>
  )
}
