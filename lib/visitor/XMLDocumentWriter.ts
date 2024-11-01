import window from "@k0michi/isomorphic-dom";
import XMLNodeWriter from "./XMLNodeWriter";
import XMLNodeVisitor from "./XMLNodeVisitor";

export default class XMLDocumentWriter extends XMLNodeWriter {
  #emitXMLDecl = true;
  #xmlVersion = '1.0';
  #xmlEncoding = 'UTF-8';

  constructor(next?: XMLNodeVisitor | null) {
    super(next, window.document.implementation.createDocument(null, null));
  }

  setEmitXMLDecl(emit: boolean) {
    this.#emitXMLDecl = emit;
  }

  doesEmitXMLDecl() {
    return this.#emitXMLDecl;
  }

  setXMLVersion(version: string) {
    this.#xmlVersion = version;
  }

  getXMLVersion() {
    return this.#xmlVersion;
  }

  setXMLEncoding(encoding: string) {
    this.#xmlVersion = encoding;
  }

  getXMLEncoding() {
    return this.#xmlEncoding;
  }

  toString(): string {
    let result = this.#emitXMLDecl ? `<?xml version="${this.#xmlVersion}" encoding="${this.#xmlEncoding}"?>` : '';
    result += super.toString();
    return result;
  }
}