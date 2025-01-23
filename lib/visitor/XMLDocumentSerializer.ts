import XMLNodeVisitor from "./XMLNodeVisitor";
import XMLDocumentWriter from "./XMLDocumentWriter";
import XMLHelper from "./XMLHelper";

export default class XMLDocumentSerializer extends XMLDocumentWriter {
  #emitXMLDecl = true;
  #xmlVersion = '1.0';
  #xmlEncoding = 'UTF-8';

  constructor(next?: XMLNodeVisitor | null) {
    super(next);
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
    result += XMLHelper.serialize(this.container);
    return result;
  }
}