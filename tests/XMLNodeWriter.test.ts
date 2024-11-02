import { describe, expect, test } from '@jest/globals';
import XMLDocumentReader from '../lib/visitor/XMLDocumentReader';
import XMLDocumentWriter from '../lib/visitor/XMLDocumentWriter';
import XMLPrinter from '../lib/visitor/XMLPrinter';

function roundtrip(xml: string) {
  const reader = XMLDocumentReader.fromString(xml);
  const writer = new XMLDocumentWriter();
  writer.setEmitXMLDecl(false);
  reader.accept(writer);
  expect(writer.toString()).toBe(xml);
}

describe('XMLNodeWriter', () => {
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

  test('Document Type 1', () => {
    roundtrip(`<!DOCTYPE greeting SYSTEM "hello.dtd"><greeting>Hello, world!</greeting>`);
  });

  test('XML Decl 1', () => {
    const reader = XMLDocumentReader.fromString(`<a href="https://koyomiji.com/"/>`);
    const writer = new XMLDocumentWriter();
    writer.setEmitXMLDecl(true);
    reader.accept(writer);
    expect(writer.toString()).toBe(`<?xml version="1.0" encoding="UTF-8"?><a href="https://koyomiji.com/"/>`);
  });
});