import React from 'react'

import { ElectricalCore } from '../../components/ElectricalCore'
import { Schematic } from '../../components/Schematic'
import ANDGate from './and-gate.png'

export default {
  title: 'Basic/ElectricalCore',
  component: ElectricalCore,
  parameters: {
    docs: {
      description: {
        component:
          'All electrical components are created from this one. `<ElectricalCore />` takes care of all the logic that comes with assembling the component itself. You can use this component to make your own custom electrical components.'
      },
      source: {
        type: 'code'
      }
    }
  }
}

export const ResistorExample = () => (
  <Schematic height={150} width={200}>
    <ElectricalCore
      type='Resistor'
      position={{ x: 50, y: 40 }}
      label={{
        name: 'R',
        value: '10k',
        unit: 'Ω',
        position: { x: 10, y: 0 }
      }}
      ports={[
        {
          type: 'hybrid',
          position: { x: 0, y: 0.5 }
        },
        {
          type: 'hybrid',
          position: { x: 1, y: 0.5 }
        }
      ]}
    />
  </Schematic>
)

export const AlternateImages = () => {
  const data = {
    type: 'DC Voltage Source',
    ports: [{ position: { x: 0.5, y: 0 } }, { position: { x: 0.5, y: 1 } }]
  }

  return (
    <Schematic height={150} width={200}>
      <ElectricalCore position={{ x: 0, y: 30 }} {...data} />
      <ElectricalCore position={{ x: 100, y: 30 }} altImageIdx={1} {...data} />
    </Schematic>
  )
}

export const CustomComponent = () => (
  <Schematic height={150} width={200}>
    <ElectricalCore
      // 👇 You can add your own type, image and size
      type='AND Gate'
      imgPath={ANDGate} // `import ANDGate from './and-gate.png'`
      size={120}
      // ☝ You can add your own type, image and size
      position={{ x: 20, y: 50 }}
      ports={[
        {
          type: 'input',
          position: { x: 0.1, y: 0.3 }
        },
        {
          type: 'input',
          position: { x: 0.1, y: 0.7 }
        },
        {
          type: 'output',
          position: { x: 0.9, y: 0.5 }
        }
      ]}
    />
  </Schematic>
)
