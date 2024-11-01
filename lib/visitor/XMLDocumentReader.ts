import XMLNodeReader from './XMLNodeReader';

export default class XMLDocumentReader extends XMLNodeReader {
  constructor(root: Document);
  constructor(string: string);
  constructor(...args: any[]) {
    super(
      typeof (args[0]) === 'string' ?
        XMLDocumentReader.#parseXML(args[0]) :
        args[0]
    );

    if (args.length > 1) {
      throw new Error(`Wrong arguments`);
    }
  }

  static #parseXML(string: string) {
    const parser = new window.DOMParser();
    const document = parser.parseFromString(string, 'text/xml');

    if (document.querySelector('parsererror') != null) {
      throw new Error('Failed to parse XML');
    }

    return document;
  }
}