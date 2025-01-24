import { describe, expect, test } from '@jest/globals';
import XMLFragmentReader from '../lib/visitor/XMLFragmentReader';
import XMLFragmentWriter from '../lib/visitor/XMLFragmentWriter';
import XMLFragmentParser from '../lib/visitor/XMLFragmentParser';
import XMLFragmentSerializer from '../lib/visitor/XMLFragmentSerializer';
import XMLDocumentParser from '../lib/visitor/XMLDocumentParser';

describe('XMLDocumentParser', () => {
  test('Error 1', () => {
    expect(() => new XMLDocumentParser(`<>`)).toThrow(Error);
  });

  test('Not Error 1', () => {
    expect(() => new XMLDocumentParser(`<parsererror/>`)).not.toThrow(Error);
  });

  test('Not Error 2', () => {
    expect(() => new XMLDocumentParser(`<parsererror xmlns="http://www.mozilla.org/newlayout/xml/parsererror.xml"/>`)).not.toThrow(Error);
  });
});