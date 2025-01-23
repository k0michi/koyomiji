import { describe, expect, test } from '@jest/globals';
import XMLFragmentReader from '../lib/visitor/XMLFragmentReader';
import XMLFragmentWriter from '../lib/visitor/XMLFragmentWriter';
import XMLFragmentParser from '../lib/visitor/XMLFragmentParser';
import XMLFragmentSerializer from '../lib/visitor/XMLFragmentSerializer';

function roundtrip(xml: string) {
  const reader = new XMLFragmentParser(xml);
  const writer = new XMLFragmentSerializer();
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