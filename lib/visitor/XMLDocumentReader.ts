import window from "@k0michi/isomorphic-dom";
import XMLDocumentVisitor from "./XMLDocumentVisitor";
import XMLElementReader from "./XMLElementReader";

export default class XMLDocumentReader {
  parser = new window.DOMParser();
  document: Document;

  constructor(document: Document);
  constructor(string: string);
  constructor(...args: any[]) {
    if (args.length === 1) {
      if (args[0] instanceof window.Document) {
        this.document = args[0];
        return;
      } else if (typeof (args[0]) === 'string') {
        this.document = this.parser.parseFromString(args[0], 'text/xml');
        return;
      }
    }

    throw new Error(`Wrong arguments`);
  }

  accept(visitor: XMLDocumentVisitor) {
    for (const c of this.document.childNodes) {
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