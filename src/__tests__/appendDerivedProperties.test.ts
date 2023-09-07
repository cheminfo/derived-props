import { produce } from 'immer';
import { test, expect } from 'vitest';

import { appendDerivedProperties } from '..';

test('deriveProps simple', () => {
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
  const callback = (value: number) => value + shift;

  // In this mapping we ignore the arrays indices
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

  expect(data).toStrictEqual({
    propertyName: 'John',
    originalX: 30,
    data: { originalX: [1, 2, 3], y: [2, 3, 4], x: [3, 4, 5] },
    ranges: [
      { originalFrom: 1, originalTo: 2, from: 3, to: 4 },
      { originalFrom: 3, originalTo: 4, from: 5, to: 6 },
    ],
    x: 32,
  });
});

test('deriveProps big', () => {
  const data: any = {
    x: new Float64Array(1e7),
  };

  const start = Date.now();

  const callback = (value: number) => value + 1;
  // In this mapping we ignore the arrays indices
  const appenders = {
    x: {
      propertyName: 'y',
      callback,
    },
  };

  appendDerivedProperties(data, appenders);

  let sum = 0;
  for (let i = 0; i < data.x.length; i++) {
    sum = sum + data.x[i] + data.y[i];
  }
  expect(sum).toBe(1e7);

  expect(Date.now() - start).toBeLessThan(1000);
});

test('with immer', () => {
  const data = {
    x: new Float64Array(1e7),
  };

  const start = Date.now();

  const callback = (value: number) => value + 1;
  // In this mapping we ignore the arrays indices
  const appenders = {
    x: {
      propertyName: 'y',
      callback,
    },
  };

  const nextData: any = produce(data, (draft) => {
    appendDerivedProperties(draft, appenders);
  });

  let sum = 0;
  for (let i = 0; i < nextData.x.length; i++) {
    sum = sum + nextData.x[i] + nextData.y[i];
  }
  expect(sum).toBe(1e7);

  expect(Date.now() - start).toBeLessThan(1000);
});
