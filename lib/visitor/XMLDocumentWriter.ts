import window from "@k0michi/isomorphic-dom";
import XMLDocumentVisitor from "./XMLDocumentVisitor";
import XMLElementVisitor from "./XMLElementVisitor";
import XMLElementWriter from "./XMLElementWriter";

export default class XMLDocumentWriter extends XMLDocumentVisitor {
  serializer: XMLSerializer = new XMLSerializer();
  document: Document;

  constructor() {
    super();
    this.document = window.document.implementation.createDocument(null, null);
  }

  visitElement(namespaceURI: string | null, qualifiedName: string): XMLElementVisitor | null {
    const el = this.document.createElementNS(namespaceURI, qualifiedName);
    this.document.appendChild(el);
    return new XMLElementWriter(el);
  }

  visitProcessingInstruction(target: string, data: string): void {
    this.document.appendChild(this.document.createProcessingInstruction(target, data));
  }

  visitComment(data: string): void {
    this.document.appendChild(this.document.createComment(data));
  }

  visitDocumentType(qualifiedName: string, publicId: string, systemId: string): void {
    this.document.appendChild(window.document.implementation.createDocumentType(qualifiedName, publicId, systemId));
  }

  toNode() {
    return this.document.cloneNode(true);
  }

  toString() {
    return this.serializer.serializeToString(this.document);
  }
}