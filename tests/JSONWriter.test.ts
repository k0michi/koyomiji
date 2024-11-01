import { describe, expect, test } from '@jest/globals';
import { JSONValue } from '../lib/visitor/JSON.index';
import JSONReader from '../lib/visitor/JSONReader';
import JSONWriter from '../lib/visitor/JSONWriter';

function roundtrip(value: JSONValue) {
  const reader = new JSONReader(value);
  const writer = new JSONWriter();
  reader.accept(writer);
  expect(JSON.parse(writer.toString())).toStrictEqual(value);
}

describe('JSONWriter', () => {
  test('Number 1', () => {
    roundtrip(1);
  });

  test('String 1', () => {
    roundtrip('str');
  });

  test('Null 1', () => {
    roundtrip(null);
  });

  test('Array 1', () => {
    roundtrip([1, 2, 3]);
  });

  test('Object 1', () => {
    roundtrip({
      a: 1,
      b: 2,
      c: 3,
    });
  });

  test('Boolean 1', () => {
    roundtrip(true);
  });

  test('Deep Nest 1', () => {
    roundtrip([[[[[[[[[[[[[[[]]]]]]]]]]]]]]]);
  });

  test('Deep Nest 2', () => {
    roundtrip({ a: { a: { a: { a: { a: { a: { a: { a: { a: { a: { a: { a: { a: { a: { a: { a: { a: { a: { a: { a: 1 } } } } } } } } } } } } } } } } } } } });
  });
});