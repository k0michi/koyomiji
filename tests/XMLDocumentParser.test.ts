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

  test('Error 2', () => {
    expect(() => new XMLDocumentParser(`<`)).toThrow(Error);
  });

  test('Error 3', () => {
    expect(() => new XMLDocumentParser(`<!--`)).toThrow(Error);
  });

  test('Error 4', () => {
    expect(() => new XMLDocumentParser(`<!CDATA[`)).toThrow(Error);
  });

  test('Error 5', () => {
    expect(() => new XMLDocumentParser(`<?`)).toThrow(Error);
  });

  test('Error 6', () => {
    expect(() => new XMLDocumentParser(`>`)).toThrow(Error);
  });

  test('Error 7', () => {
    expect(() => new XMLDocumentParser(`<!--a-->`)).toThrow(Error);
  });

  test('Error 8', () => {
    expect(() => new XMLDocumentParser(`<?a ?>`)).toThrow(Error);
  });

  test('Error 9', () => {
    expect(() => new XMLDocumentParser(``)).toThrow(Error);
  });

  test('Error 10', () => {
    expect(() => new XMLDocumentParser(`a`)).toThrow(Error);
  });

  test('Edge Case 1', () => {
    expect(() => new XMLDocumentParser(`<parsererror/>`)).not.toThrow(Error);
  });

  test('Edge Case 2', () => {
    expect(() => new XMLDocumentParser(`<parsererror xmlns="http://www.mozilla.org/newlayout/xml/parsererror.xml"/>`)).not.toThrow(Error);
  });

  test('Decl 1', () => {
    expect(() => new XMLDocumentParser(`<?xml version="1.0" encoding="UTF-8"?><a/>`)).not.toThrow(Error);
  });
});