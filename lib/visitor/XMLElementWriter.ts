import XMLElementVisitor from "./XMLElementVisitor";

export default class XMLElementWriter extends XMLElementVisitor {
  element: Element;

  constructor(next: XMLElementVisitor | null | undefined, element: Element) {
    super(next);
    this.element = element;
  }

  visitElement(namespaceURI: string | null, qualifiedName: string): XMLElementVisitor | null {
    const el = this.element.ownerDocument.createElementNS(namespaceURI, qualifiedName);
    this.element.appendChild(el);
    return new XMLElementWriter(this.next, el);
  }

  visitAttribute(namespace: string | null, qualifiedName: string, value: string): void {
    this.element.setAttributeNS(namespace, qualifiedName, value);
  }

  visitTextNode(data: string): void {
    this.element.appendChild(this.element.ownerDocument.createTextNode(data));
  }

  visitCDATASection(data: string): void {
    this.element.appendChild(this.element.ownerDocument.createCDATASection(data));
  }

  visitProcessingInstruction(target: string, data: string): void {
    this.element.appendChild(this.element.ownerDocument.createProcessingInstruction(target, data));
  }

  visitComment(data: string): void {
    this.element.appendChild(this.element.ownerDocument.createComment(data));
  }
}