import { describe, expect, test } from '@jest/globals';
import ReactFragmentWriter from '../lib/visitor/ReactFragmentWriter';
import ReactNodeWriter from '../lib/visitor/ReactNodeWriter';
import { ReactNode } from 'react';
import ReactDOMServer from 'react-dom/server';

describe('ReactFragmentWriter', () => {
  test('Element 1', () => {
    const writer = new ReactFragmentWriter();
    const el = writer.visitElement('a');
    el?.visitEnd();
    writer.visitEnd();
    expect(ReactDOMServer.renderToString(writer.toReactNode())).toBe('<a></a>');
  });

  test('Text 1', () => {
    const writer = new ReactFragmentWriter();
    const el = writer.visitElement('a');
    el?.visitString('foo');
    el?.visitEnd();
    writer.visitEnd();
    expect(ReactDOMServer.renderToString(writer.toReactNode())).toBe('<a>foo</a>');
  });

  test('Element 2', () => {
    const writer = new ReactFragmentWriter();
    let el = writer.visitElement('a');
    el?.visitString('foo');
    el?.visitEnd();
    el = writer.visitElement('a');
    el?.visitString('foo');
    el?.visitEnd();
    writer.visitEnd();
    expect(ReactDOMServer.renderToString(writer.toReactNode())).toBe('<a>foo</a><a>foo</a>');
  });

  test('Prop 1', () => {
    const writer = new ReactFragmentWriter();
    let el = writer.visitElement('a');
    el?.visitProp('href', '/');
    el?.visitString('foo');
    el?.visitEnd();
    writer.visitEnd();
    expect(ReactDOMServer.renderToString(writer.toReactNode())).toBe('<a href="/">foo</a>');
  });
});