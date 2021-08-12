import React, { useRef } from 'react';

import { Connection } from '../components/Connection';
import { Node } from '../components/Node';

export default {
  title: 'Low Level API/Connection',
  component: Connection,
  argTypes: {
    start: { control: '' },
    end: { control: '' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'The Connection component allows the user to connect Ports and Nodes.',
      },
      source: {
        type: 'code',
      },
    },
  },
};

export const Simple = () => {
  const start = useRef();
  const end = useRef();

  return (
    <>
      <Node ref={start} position={{ x: 10, y: 10 }} />
      <Node ref={end} position={{ x: 200, y: 100 }} />

      <Connection start={start} end={end} />
    </>
  );
};
