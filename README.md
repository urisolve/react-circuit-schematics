# react-draw-circuits

> A React library that allows you to draw circuit schematics

## Install

You can install this library with any package manager that supports npm modules.

```bash
npm install react-circuit-schematics
```

```bash
yarn add react-circuit-schematics
```

## Usage

```jsx
import React from 'react'
import { Schematic, useSchematic } from 'react-circuit-schematics'

export const EmptySchematic = () => {
  const { schematic } = useSchematic()
  return <Schematic schematic={schematic} />
}
```

## Documentation

There is a Storybook hosted on Netlify of this library that you can use as documentation.

URL: https://react-draw-circuits.netlify.app/

You can also host the storybook on you own machine by cloning this repository and executing `npm run storybook` or `yarn storybook`.

## License

MIT © [URIsolve](https://urisolve.pt/app/)
