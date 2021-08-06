# react-draw-circuits

> A React library that allows you to draw circuit schematics

[![NPM](https://img.shields.io/npm/v/react-draw-circuits.svg)](https://www.npmjs.com/package/react-circuit-schematics)
[![Netlify Status](https://api.netlify.com/api/v1/badges/4b893982-6105-499c-971e-a42eb0797b37/deploy-status)](https://app.netlify.com/sites/react-draw-circuits/deploys)

## Install

```bash
npm i react-circuit-schematics
```

## Usage

```jsx
import React from 'react'
import { Schematic, useSchematic } from 'react-circuit-schematics'

export const App = () => {
  const { schematic } = useSchematic()
  return <Schematic schematic={schematic} />
}
```

## Documentation

There is a Storybook hosted on Netlify of this library that you can use as documentation.

URL: https://react-draw-circuits.netlify.app/

## License

MIT © [URIsolve](https://urisolve.pt/app/)
