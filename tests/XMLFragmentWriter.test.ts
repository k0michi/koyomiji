import { describe, expect, test } from '@jest/globals';
import XMLDocumentFragmentReader from '../lib/visitor/XMLDocumentFragmentReader';
import XMLDocumentFragmentWriter from '../lib/visitor/XMLDocumentFragmentWriter';
import XMLDocumentFragmentParser from '../lib/visitor/XMLDocumentFragmentParser';
import XMLDocumentFragmentSerializer from '../lib/visitor/XMLDocumentFragmentSerializer';

function roundtrip(xml: string) {
  const reader = new XMLDocumentFragmentParser(xml);
  const writer = new XMLDocumentFragmentSerializer();
  reader.accept(writer);
  expect(writer.toString()).toBe(xml);
}

describe('XMLFragmentWriter', () => {
  test('Element 1', () => {
    roundtrip(`<a/>`);
  });

  test('Attribute 1', () => {
    roundtrip(`<a href="https://koyomiji.com/"/>`);
  });

  test('Attribute 2', () => {
    roundtrip(`<a a="1" b="2" c="3"/>`);
  });

  test('Element 2', () => {
    roundtrip(`<a><b/></a>`);
  });

  test('Element 3', () => {
    roundtrip(`<a><b/><c/></a>`);
  });

  test('Text 1', () => {
    roundtrip(`<a>abc</a>`);
  });

  test('CDATA 1', () => {
    roundtrip(`<a><![CDATA[abc<>&"']]></a>`);
  });

  test('Processing Instruction 1', () => {
    roundtrip(`<?abc ?><a/>`);
  });

  test('Processing Instruction 2', () => {
    roundtrip(`<?abc e="f"?><a/>`);
  });

  test('Comment 1', () => {
    roundtrip(`<a><!--comment--></a>`);
  });

  test('Comment 2', () => {
    roundtrip(`<a/><!--a-->`);
  });

  test('Comment 3', () => {
    roundtrip(`<!--b--><a/><!--a-->`);
  });

  test('Fragment Element 1', () => {
    roundtrip(`<a/><b/>`);
  });

  test('Fragment Element 2', () => {
    roundtrip(`<a><e/></a><b/><c/><d/>`);
  });

  test('Fragment Text 1', () => {
    roundtrip(`a<a/>b`);
  });

  test('Fragment CDATA 1', () => {
    roundtrip(`<a/><![CDATA[abc<>&"']]>`);
  });
});