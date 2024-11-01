import window from "@k0michi/isomorphic-dom";
import XMLDocumentVisitor from "./XMLRootVisitor";
import XMLElementVisitor from "./XMLElementVisitor";
import XMLElementWriter from "./XMLElementWriter";
import XMLRootVisitor from "./XMLRootVisitor";
import XMLRootWriter from "./XMLRootWriter";

export default class XMLDocumentWriter extends XMLRootWriter {
  constructor(next?: XMLDocumentWriter | null) {
    super(next, window.document.implementation.createDocument(null, null));
  }
}