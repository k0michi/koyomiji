export default class XMLNodeVisitor {
  next: XMLNodeVisitor | null;

  constructor(next?: XMLNodeVisitor | null) {
    this.next = next ?? null;
  }

  visitElement(namespaceURI: string | null, qualifiedName: string): XMLNodeVisitor | null {
    return this.next?.visitElement(namespaceURI, qualifiedName) ?? null;
  }

  visitAttribute(namespace: string | null, qualifiedName: string, value: string) {
    this.next?.visitAttribute(namespace, qualifiedName, value);
  }

  visitAttributeEnd() {
    this.next?.visitAttributeEnd();
  }

  visitTextNode(data: string) {
    this.next?.visitTextNode(data);
  }

  visitCDATASection(data: string) {
    this.next?.visitCDATASection(data);
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

  visitEnd() {
    this.next?.visitEnd();
  }
}