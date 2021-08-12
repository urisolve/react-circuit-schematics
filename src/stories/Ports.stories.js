import React from 'react';
import { Port } from '../components/Port';

export default {
  title: 'Low Level API/Port',
  component: Port,
  parameters: {
    docs: {
      description: {
        component:
          'The Port component is what allows the user to create connections between components',
      },
      source: {
        type: 'code',
      },
    },
  },
};

export const Simple = () => (
  <div style={{ position: 'relative' }}>
    <Port />
  </div>
);
