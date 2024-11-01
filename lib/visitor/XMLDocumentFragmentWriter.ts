import XMLNodeWriter from "./XMLNodeWriter";

export default class XMLDocumentWriter extends XMLNodeWriter {
  constructor(next?: XMLDocumentWriter | null) {
    super(next, window.document.implementation.createDocument(null, null).createDocumentFragment());
  }
}