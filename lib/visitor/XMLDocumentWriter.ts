import window from "@k0michi/isomorphic-dom";
import XMLNodeWriter from "./XMLNodeWriter";
import XMLNodeVisitor from "./XMLNodeVisitor";

export default class XMLDocumentWriter extends XMLNodeWriter {
  constructor(next?: XMLNodeVisitor | null) {
    super(next, window.document.implementation.createDocument(null, null));
  }
}