// eslint-disable-next-line camelcase
export const RLC_Circuit = {
  components: [
    {
      id: '8c0168ec-07fe-4b2c-96ee-4292ab34cfb2',
      type: 'DC Voltage Source',
      position: { x: 50, y: 150 },
      label: {
        name: 'U',
        value: '5',
        unit: 'V',
        position: { x: 120, y: 220 }
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
      position: { x: 200, y: 100 },
      label: {
        name: 'R',
        value: '10k',
        unit: 'Ω',
        position: { x: 210, y: 110 }
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
    },
    {
      id: 'ffe5a9ee-6619-4092-8246-336621497794',
      type: 'Inductor',
      position: { x: 400, y: 100 },
      label: {
        name: 'L',
        value: '10m',
        unit: 'H',
        position: { x: 410, y: 110 }
      },
      ports: [
        {
          id: '8909cf3b-f5cd-4edf-850a-37d1ac6ad9ed',
          type: 'hybrid',
          position: { x: 0, y: 0.5 }
        },
        {
          id: 'e7bb96c9-8eae-41c5-a361-7a38836505a8',
          type: 'hybrid',
          position: { x: 1, y: 0.5 }
        }
      ]
    },
    {
      id: 'ef4bc1f6-e72f-4c4c-b9bb-76ea5d36c13b',
      type: 'Capacitor',
      position: { x: 510, y: 200, angle: 90 },
      label: {
        name: 'C',
        value: '1µ',
        unit: 'F',
        position: { x: 580, y: 220 }
      },
      ports: [
        {
          id: 'dc54f032-592a-4c89-90d6-0727add0908f',
          type: 'hybrid',
          position: { x: 0, y: 0.5 }
        },
        {
          id: 'b4c2c42a-24d8-4230-8ee7-f8330926205f',
          type: 'hybrid',
          position: { x: 1, y: 0.5 }
        }
      ]
    }
  ],
  nodes: [],
  connections: [
    {
      id: 'da7214da-14c6-49ab-9ca6-5b2ed8a184d3',
      start: '1f7b8784-184b-4733-ae81-53c74b62462c',
      end: '8909cf3b-f5cd-4edf-850a-37d1ac6ad9ed'
    },
    {
      id: 'fd313c9d-03f2-437d-8462-331e4efc660a',
      start: 'e7bb96c9-8eae-41c5-a361-7a38836505a8',
      end: 'dc54f032-592a-4c89-90d6-0727add0908f'
    },
    {
      id: 'aa09ec37-a2f4-4f9a-a594-710094a61b81',
      start: 'b4c2c42a-24d8-4230-8ee7-f8330926205f',
      end: 'c990e78e-2bc5-4afb-92ee-b8a6d1faab0f'
    },
    {
      id: '7a141173-c7f0-4e4c-9120-2a363dba9f79',
      start: '7ed2507f-14fe-45e2-9246-9ee1d36eb442',
      end: 'ddd6efab-f8f2-4565-8010-1270556f1d00'
    }
  ]
}
