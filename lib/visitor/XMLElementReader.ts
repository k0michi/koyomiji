import XMLElementVisitor from "./XMLElementVisitor";

export default class XMLElementReader {
  element: Element;

  constructor(element: Element) {
    this.element = element;
  }

  accept(visitor: XMLElementVisitor) {
    for (const c of this.element.childNodes) {
      switch (c.nodeType) {
        case window.Node.ELEMENT_NODE:
          const el = c as Element;
          const elVisitor = visitor.visitElement(el.namespaceURI, el.tagName);

          if (elVisitor !== null) {
            const elReader = new XMLElementReader(el);
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
        default:
      }
    }
  }
}