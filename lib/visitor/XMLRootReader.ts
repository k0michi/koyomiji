import XMLElementReader from "./XMLElementReader";
import XMLRootVisitor from "./XMLRootVisitor";

export default class XMLRootReader {
  parser = new window.DOMParser();
  root: Document | DocumentFragment;

  constructor(root: Document | DocumentFragment);
  constructor(string: string, fragment: boolean);
  constructor(...args: any[]) {
    if (args.length === 1) {
      if (args[0] instanceof window.Document) {
        this.root = args[0];
        return;
      } else if (args[0] instanceof window.DocumentFragment) {
        this.root = args[0];
        return;
      }
    } else if (args.length === 2) {
      if (typeof (args[0]) === 'string' && typeof (args[1]) === 'boolean') {
        if (args[1]) {
          this.root = this.#parseXMLFragment(args[0]);
        } else {
          this.root = this.#parseXML(args[0]);
        }
        return;
      }
    }

    throw new Error(`Wrong arguments`);
  }

  #parseXML(string: string) {
    const document = this.parser.parseFromString(string, 'text/xml');

    if (document.querySelector('parsererror') != null) {
      throw new Error('Failed to parse XML');
    }

    return document;
  }

  #parseXMLFragment(string: string) {
    string = `<root>${string}</root>`;
    const document = this.parser.parseFromString(string, 'text/xml');

    if (document.querySelector('parsererror') != null) {
      throw new Error('Failed to parse XML');
    }

    const fragment = document.createDocumentFragment();

    for (const c of document.documentElement.childNodes) {
      fragment.appendChild(c);
    }

    return fragment;
  }

  accept(visitor: XMLRootVisitor) {
    for (const c of this.root.childNodes) {
      switch (c.nodeType) {
        case window.Node.ELEMENT_NODE:
          const el = c as Element;
          const elVisitor = visitor.visitElement(el.namespaceURI, el.tagName);

          if (elVisitor !== null) {
            const elReader = new XMLElementReader(el);
            elReader.accept(elVisitor);
          }
          break;
        case window.Node.PROCESSING_INSTRUCTION_NODE:
          const pi = c as ProcessingInstruction;
          visitor.visitProcessingInstruction(pi.target, pi.data);
          break;
        case window.Node.COMMENT_NODE:
          const co = c as Comment;
          visitor.visitComment(co.data);
          break;
        case window.Node.DOCUMENT_TYPE_NODE:
          const dt = c as DocumentType;
          visitor.visitDocumentType(dt.name, dt.publicId, dt.systemId);
          break;
        default:
      }
    }
  }
}