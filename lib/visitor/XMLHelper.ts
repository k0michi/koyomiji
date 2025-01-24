import window from "@k0michi/isomorphic-dom";

export class XMLParsingError extends Error {
  parsererror?: Element;

  constructor(parsererror?: Element) {
    super(XMLParsingError.#firstLine(parsererror));
    this.parsererror = parsererror;
    this.name = 'XMLParsingError';
  }

  static #firstLine(parsererror?: Element) {
    if (!parsererror) {
      return undefined;
    }

    const div = parsererror.querySelector('div');
    let message;

    if (div) {
      // Chrome, Safari
      message = div.textContent!;
    } else {
      // Firefox
      message = parsererror.textContent!;
    }

    if (message.indexOf('\n') != -1) {
      message = message.substring(0, message.indexOf('\n'));
    }

    return message;
  }
}

export default class XMLHelper {
  // https://github.com/Cauterite/domparser-tests
  static parse(string: string) {
    const parser = new window.DOMParser();
    const document = parser.parseFromString(`${string}<?end ?>`, 'text/xml');
    const last = document.lastChild;

    if (last === null
      || last.nodeType !== window.Node.PROCESSING_INSTRUCTION_NODE
      || (last as ProcessingInstruction).target !== 'end'
      || (last as ProcessingInstruction).data !== '') {
      const errorDocument = parser.parseFromString(string, 'text/xml');
      const parsererror = errorDocument.querySelector(`parsererror:not(:has(parsererror))`) ?? undefined;
      throw new XMLParsingError(parsererror);
    }

    document.removeChild(last);
    const errorCount = document.documentElement.getElementsByTagName('parsererror').length;

    if (errorCount > 0) {
      const errorDocument = parser.parseFromString(`${string}<?`, 'text/xml');

      if (errorDocument.documentElement.getElementsByTagName('parsererror').length === errorCount) {
        const errorDocument = parser.parseFromString(string, 'text/xml');
        const parsererror = errorDocument.querySelector(`parsererror:not(:has(parsererror))`) ?? undefined;
        throw new XMLParsingError(parsererror);
      }
    }

    return document;
  }

  static parseFragment(string: string) {
    const document = this.parse(`<root>${string}</root>`);
    const fragment = document.createDocumentFragment();

    while (document.documentElement.firstChild) {
      fragment.appendChild(document.documentElement.firstChild);
    }

    return fragment;
  }

  static serialize(node: Node) {
    const serializer = new window.XMLSerializer();
    return serializer.serializeToString(node);
  }
}