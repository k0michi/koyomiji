import window from "@k0michi/isomorphic-dom";

export default class XMLHelper {
  static parse(string: string) {
    const parser = new window.DOMParser();
    string = `${string}<?end ?>`;
    const document = parser.parseFromString(string, 'text/xml');
    const last = document.lastChild;

    if (last === null
      || last.nodeType !== window.Node.PROCESSING_INSTRUCTION_NODE
      || (last as ProcessingInstruction).target !== 'end'
      || (last as ProcessingInstruction).data !== '') {
      const parsererror = document.querySelector('parsererror');
      throw new Error(`XML parser error: ${parsererror?.textContent}`);
    }

    document.removeChild(last);
    return document;
  }

  static parseFragment(string: string) {
    const parser = new window.DOMParser();
    string = `<root>${string}</root>`;
    const document = parser.parseFromString(string, 'text/xml');

    if (document.documentElement.tagName !== 'root') {
      const parsererror = document.querySelector('parsererror');
      throw new Error(`XML parser error: ${parsererror?.textContent}`);
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