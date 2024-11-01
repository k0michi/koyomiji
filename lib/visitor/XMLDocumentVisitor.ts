import XMLElementVisitor from "./XMLElementVisitor";

export default class XMLDocumentVisitor {
  next: XMLDocumentVisitor | null;

  constructor(next?: XMLDocumentVisitor | null) {
    this.next = next ?? null;
  }

  visitElement(namespaceURI: string | null, qualifiedName: string): XMLElementVisitor | null {
    return this.next?.visitElement(namespaceURI, qualifiedName) ?? null;
  }

  visitProcessingInstruction(target: string, data: string) {
    this.next?.visitProcessingInstruction(target, data);
  }

  visitComment(data: string) {
    this.next?.visitComment(data);
  }

  visitDocumentType(qualifiedName: string, publicId: string, systemId: string) {
    this.next?.visitDocumentType(qualifiedName, publicId, systemId);
  }
}