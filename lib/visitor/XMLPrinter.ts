import XMLNodeVisitor from "./XMLNodeVisitor";

export default class XMLPrinter extends XMLNodeVisitor {
  indent: number;

  constructor(next?: XMLNodeVisitor | null, indent?: number) {
    super(next);
    this.indent = indent ?? 0;
  }

  visitElement(namespaceURI: string | null, qualifiedName: string): XMLNodeVisitor | null {
    console.log(' '.repeat(this.indent) + 'visitElement', namespaceURI, qualifiedName);
    return new XMLPrinter(super.visitElement(namespaceURI, qualifiedName), this.indent + 2);
  }

  visitAttribute(namespace: string | null, qualifiedName: string, value: string): void {
    console.log(' '.repeat(this.indent) + 'visitAttribute', namespace, qualifiedName, value);
    super.visitAttribute(namespace, qualifiedName, value);
  }

  visitTextNode(data: string): void {
    console.log(' '.repeat(this.indent) + 'visitTextNode', data);
    super.visitTextNode(data);
  }

  visitCDATASection(data: string): void {
    console.log(' '.repeat(this.indent) + 'visitCDATASection', data);
    super.visitCDATASection(data);
  }

  visitProcessingInstruction(target: string, data: string): void {
    console.log(' '.repeat(this.indent) + 'visitProcessingInstruction', target, data);
    super.visitProcessingInstruction(target, data);
  }

  visitComment(data: string): void {
    console.log(' '.repeat(this.indent) + 'visitComment', data);
    super.visitComment(data);
  }

  visitDocumentType(qualifiedName: string, publicId: string, systemId: string): void {
    console.log(' '.repeat(this.indent) + 'visitDocumentType', qualifiedName, publicId, systemId);
    super.visitDocumentType(qualifiedName, publicId, systemId);
  }

  visitEnd(): void {
    console.log(' '.repeat(this.indent) + 'visitEnd');
    super.visitEnd();
  }
}