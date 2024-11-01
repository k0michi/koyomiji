import window from "@k0michi/isomorphic-dom";
import XMLElementVisitor from "./XMLElementVisitor";
import XMLElementWriter from "./XMLElementWriter";
import XMLRootVisitor from "./XMLRootVisitor";

export default class XMLRootWriter extends XMLRootVisitor {
  serializer: XMLSerializer = new XMLSerializer();
  root: Document | DocumentFragment;
  document: Document;

  constructor(next: XMLRootVisitor | null | undefined, root: Document | DocumentFragment) {
    super(next);
    this.root = root;
    this.document = this.root.nodeType === window.Node.DOCUMENT_NODE ? this.root as Document : this.root.ownerDocument!;
  }

  visitElement(namespaceURI: string | null, qualifiedName: string): XMLElementVisitor | null {
    const el = this.document.createElementNS(namespaceURI, qualifiedName);
    this.root.appendChild(el);
    return new XMLElementWriter(super.visitElement(namespaceURI, qualifiedName), el);
  }

  visitProcessingInstruction(target: string, data: string): void {
    this.root.appendChild(this.document.createProcessingInstruction(target, data));
    super.visitProcessingInstruction(target, data);
  }

  visitComment(data: string): void {
    this.root.appendChild(this.document.createComment(data));
    super.visitComment(data);
  }

  visitDocumentType(qualifiedName: string, publicId: string, systemId: string): void {
    this.root.appendChild(window.document.implementation.createDocumentType(qualifiedName, publicId, systemId));
    super.visitDocumentType(qualifiedName, publicId, systemId);
  }

  toNode() {
    return this.root.cloneNode(true);
  }

  toString() {
    return this.serializer.serializeToString(this.root);
  }
}