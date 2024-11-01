export default class XMLElementVisitor {
  next: XMLElementVisitor | null;

  constructor(next?: XMLElementVisitor | null) {
    this.next = next ?? null;
  }

  visitElement(namespaceURI: string | null, qualifiedName: string): XMLElementVisitor | null {
    return this.next?.visitElement(namespaceURI, qualifiedName) ?? null;
  }

  visitAttribute(namespace: string | null, qualifiedName: string, value: string) {
    this.next?.visitAttribute(namespace, qualifiedName, value);
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
}