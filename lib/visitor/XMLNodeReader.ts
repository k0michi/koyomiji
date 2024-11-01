import window from "@k0michi/isomorphic-dom";
import XMLNodeVisitor from "./XMLNodeVisitor";

export default class XMLNodeReader {
  container: Node;

  constructor(container: Node) {
    this.container = container;
  }

  accept(visitor: XMLNodeVisitor) {
    if (this.container.nodeType === window.Node.ELEMENT_NODE) {
      const el = this.container as Element;

      for (let i = 0; i < el.attributes.length; i++) {
        const at = el.attributes.item(i)!;
        visitor.visitAttribute(at.namespaceURI, at.name, at.value);
      }
    }

    for (const c of this.container.childNodes) {
      switch (c.nodeType) {
        case window.Node.ELEMENT_NODE:
          const el = c as Element;
          const elVisitor = visitor.visitElement(el.namespaceURI, el.tagName);

          if (elVisitor !== null) {
            const elReader = new XMLNodeReader(el);
            elReader.accept(elVisitor);
          }
          break;
        case window.Node.TEXT_NODE:
          const te = c as Text;
          visitor.visitTextNode(te.data);
          break;
        case window.Node.CDATA_SECTION_NODE:
          const cd = c as CDATASection;
          visitor.visitCDATASection(cd.data);
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