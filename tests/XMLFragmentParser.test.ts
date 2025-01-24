import { describe, expect, test } from '@jest/globals';
import XMLFragmentReader from '../lib/visitor/XMLFragmentReader';
import XMLFragmentWriter from '../lib/visitor/XMLFragmentWriter';
import XMLFragmentParser from '../lib/visitor/XMLFragmentParser';
import XMLFragmentSerializer from '../lib/visitor/XMLFragmentSerializer';

describe('XMLFragmentParser', () => {
  test('Error 1', () => {
    expect(() => new XMLFragmentParser(`<>`)).toThrow(Error);
  });

  test('Edge Case 1', () => {
    expect(() => new XMLFragmentParser(`</root>`)).toThrow(Error);
  });

  test('Edge Case 2', () => {
    expect(() => new XMLFragmentParser(`</root><root>`)).toThrow(Error);
  });

  test('Edge Case 3', () => {
    expect(() => new XMLFragmentParser(``)).not.toThrow(Error);
  });

  test('Not Error 1', () => {
    expect(() => new XMLFragmentParser(`<parsererror/>`)).not.toThrow(Error);
  });

  test('Not Error 2', () => {
    expect(() => new XMLFragmentParser(`<parsererror xmlns="http://www.mozilla.org/newlayout/xml/parsererror.xml"/>`)).not.toThrow(Error);
  });
});