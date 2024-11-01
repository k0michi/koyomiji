import window from "@k0michi/isomorphic-dom";

export default class XMLHelper {
  static parse(string: string) {
    const parser = new window.DOMParser();
    const document = parser.parseFromString(string, 'text/xml');

    if (document.querySelector('parsererror') != null) {
      throw new Error('Failed to parse XML');
    }

    return document;
  }

  static parseFragment(string: string) {
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

  static serialize(node: Node) {
    const serializer = new window.XMLSerializer();
    return serializer.serializeToString(node);
  }
}