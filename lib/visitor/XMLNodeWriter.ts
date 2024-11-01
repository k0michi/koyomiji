import window from "@k0michi/isomorphic-dom";
import XMLNodeVisitor from "./XMLNodeVisitor";
import XMLHelper from "./XMLHelper";

export default class XMLNodeWriter extends XMLNodeVisitor {
  serializer: XMLSerializer = new window.XMLSerializer();
  container: Node;
  document: Document;

  constructor(next: XMLNodeVisitor | null | undefined, container: Node) {
    super(next);
    this.container = container;
    this.document = this.container.nodeType === window.Node.DOCUMENT_NODE ? this.container as Document : this.container.ownerDocument!;
  }

  visitElement(namespaceURI: string | null, qualifiedName: string): XMLNodeVisitor | null {
    const el = this.document.createElementNS(namespaceURI, qualifiedName);
    this.container.appendChild(el);
    return new XMLNodeWriter(super.visitElement(namespaceURI, qualifiedName), el);
  }

  visitAttribute(namespace: string | null, qualifiedName: string, value: string): void {
    (this.container as Element).setAttributeNS(namespace, qualifiedName, value);
    super.visitAttribute(namespace, qualifiedName, value);
  }

  visitTextNode(data: string): void {
    this.container.appendChild(this.document.createTextNode(data));
    super.visitTextNode(data);
  }

  visitCDATASection(data: string): void {
    this.container.appendChild(this.document.createCDATASection(data));
    super.visitCDATASection(data);
  }

  visitProcessingInstruction(target: string, data: string): void {
    this.container.appendChild(this.document.createProcessingInstruction(target, data));
    super.visitProcessingInstruction(target, data);
  }

  visitComment(data: string): void {
    this.container.appendChild(this.document.createComment(data));
    super.visitComment(data);
  }

  visitDocumentType(qualifiedName: string, publicId: string, systemId: string): void {
    this.container.appendChild(window.document.implementation.createDocumentType(qualifiedName, publicId, systemId));
    super.visitDocumentType(qualifiedName, publicId, systemId);
  }

  toNode() {
    return this.container.cloneNode(true);
  }

  toString() {
    return XMLHelper.serialize(this.container);
  }
}