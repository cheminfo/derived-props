# derived-props

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Calculate derived properties.

This package allows to calculate new properties based on existing one based on a jpath that will ignore arrays indices.

## Installation

`$ npm i derived-props`

## Usage

```js
import { appendDerivedProperties } from 'derived-props';

  const data = {
    propertyName: 'John',
    originalX: 30,
    data: {
      originalX: [1, 2, 3],
      y: [2, 3, 4],
    },
    ranges: [
      { originalFrom: 1, originalTo: 2 },
      { originalFrom: 3, originalTo: 4 },
    ],
  };

  const shift = 2;
  const callback = (value) => value + shift;

  // In this mapping we ignore the arrays indices
  // In this case we use the same callback for all the properties but they could be different
  const appenders = {
    'ranges.originalFrom': {
      propertyName: 'from',
      callback,
    },
    'ranges.originalTo': {
      propertyName: 'to',
      callback,
    },
    'data.originalX': {
      propertyName: 'x',
      callback,
    },
    originalX: {
      propertyName: 'x',
      callback,
    },
  };

  appendDerivedProperties(data, appenders);

/* result is ...
  {
    propertyName: 'John',
    originalX: 30,
    data: { originalX: [1, 2, 3], y: [2, 3, 4], x: [3, 4, 5] },
    ranges: [
      { originalFrom: 1, originalTo: 2, from: 3, to: 4 },
      { originalFrom: 3, originalTo: 4, from: 5, to: 6 },
    ],
    x: 32,
  }
*/
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/derived-props.svg
[npm-url]: https://www.npmjs.com/package/derived-props
[ci-image]: https://github.com/cheminfo/derived-props/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/cheminfo/derived-props/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/derived-props.svg
[codecov-url]: https://codecov.io/gh/cheminfo/derived-props
[download-image]: https://img.shields.io/npm/dm/derived-props.svg
[download-url]: https://www.npmjs.com/package/derived-props
