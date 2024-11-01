import window from '@k0michi/isomorphic-dom';
import XMLNodeReader from './XMLNodeReader';

export default class XMLDocumentFragmentReader extends XMLNodeReader {
  constructor(root: DocumentFragment);
  constructor(string: string);
  constructor(...args: any[]) {
    super(
      typeof (args[0]) === 'string' ?
        XMLDocumentFragmentReader.#parseXMLFragment(args[0]) :
        args[0]
    );

    if (args.length > 1) {
      throw new Error(`Wrong arguments`);
    }
  }

  static #parseXMLFragment(string: string) {
    const parser = new window.DOMParser();
    string = `<root>${string}</root>`;
    const document = parser.parseFromString(string, 'text/xml');

    if (document.querySelector('parsererror') != null) {
      throw new Error('Failed to parse XML');
    }

    const fragment = document.createDocumentFragment();

    while (document.documentElement.firstChild) {
      fragment.appendChild(document.documentElement.firstChild);
    }

    return fragment;
  }
}