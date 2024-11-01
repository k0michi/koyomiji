import XMLRootWriter from "./XMLRootWriter";

export default class XMLDocumentWriter extends XMLRootWriter {
  constructor(next?: XMLDocumentWriter | null) {
    super(next, window.document.implementation.createDocument(null, null).createDocumentFragment());
  }
}