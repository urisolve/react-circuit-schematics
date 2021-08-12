/* eslint-disable camelcase */
import React, { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import lodash from 'lodash';

import { Schematic } from '../components/Schematic';
import { useSchematic } from '../hooks/useSchematic';
import { RLC_Circuit } from './RLC_Circuit';

export default {
  title: 'High Level API/Schematic',
  component: Schematic,
  parameters: {
    docs: {
      description: {
        component:
          'The Schematic component is where you hold all of the electrical components.',
      },
      source: {
        type: 'code',
      },
    },
  },
};

export const Empty = () => <Schematic width={800} height={500} />;

export const ReadOnly = () => {
  const { schematic } = useSchematic(RLC_Circuit);
  return <Schematic schematic={schematic} width={800} height={500} readOnly />;
};

export const UndoAndRedo = () => {
  const { schematic, selection, history } = useSchematic(RLC_Circuit);

  return (
    <>
      <button onClick={history.undo} disabled={!history.canUndo}>
        Undo
      </button>
      <button onClick={history.redo} disabled={!history.canRedo}>
        Redo
      </button>

      <Schematic
        schematic={schematic}
        selection={selection}
        width={800}
        height={500}
      />
    </>
  );
};

export const BuildCircuit = () => {
  const [width, height] = [800, 500];
  const { schematic, selection } = useSchematic();

  // Generator function for random positions
  function* randomPosGenerator(minX, maxX, minY, maxY) {
    const genRandomIntInRange = (min, max) =>
      Math.floor(Math.random() * (max - min + 1) + min);

    while (true)
      yield {
        x: genRandomIntInRange(minX, maxX),
        y: genRandomIntInRange(minY, maxY),
      };
  }

  // Initialization of the generator
  const randomPos = randomPosGenerator(0, width - 100, 0, height - 100);
  const genRandomPos = useCallback(() => randomPos.next().value, [randomPos]);

  // Adds a resistor at a random location
  const addResistor = useCallback(() => {
    const type = lodash.sample([
      'Resistor',
      'Capacitor',
      'Inductor',
      'Voltmeter',
      'Ammeter',
    ]);

    schematic.add({
      type,
      position: genRandomPos(),
      ports: [
        { id: uuidv4(), position: { x: 0, y: 0.5 } },
        { id: uuidv4(), position: { x: 1, y: 0.5 } },
      ],
    });
  }, [schematic, genRandomPos]);

  // Adds a Node at a random location
  const addNode = useCallback(() => {
    schematic.add({ position: genRandomPos() });
  }, [schematic, genRandomPos]);

  // Adds a connection at a random location
  const addConnection = useCallback(() => {
    const node1 = { id: uuidv4(), position: genRandomPos() };
    const node2 = { id: uuidv4(), position: genRandomPos() };
    const connection = { start: node1.id, end: node2.id };

    schematic.add([node1, node2, connection]);
  }, [schematic, genRandomPos]);

  // Deletes all of the currently selected elements
  const deleteSelection = useCallback(() => {
    schematic.deleteById(selection.selectedItems);
  }, [schematic, selection.selectedItems]);

  // Rotate all of the currently selected elements
  const rotateSelection = useCallback(() => {
    schematic.editById([...selection.selectedItems], (elem) => {
      elem.position.angle = (elem.position.angle ?? 0) + 90;
      return elem;
    });
  }, [schematic, selection.selectedItems]);

  return (
    <>
      <button onClick={addResistor}>Add Component</button>
      <button onClick={addNode}>Add Node</button>
      <button onClick={addConnection}>Add Connection</button>
      <br />
      <button
        onClick={deleteSelection}
        disabled={!selection.selectedItems.size}
      >
        Delete
      </button>
      <button
        onClick={rotateSelection}
        disabled={!selection.selectedItems.size}
      >
        Rotate
      </button>

      <Schematic
        schematic={schematic}
        selection={selection}
        width={800}
        height={500}
      />
    </>
  );
};
