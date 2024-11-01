import window from "@k0michi/isomorphic-dom";
import XMLNodeVisitor from "./XMLNodeVisitor";
import XMLNodeWriter from "./XMLNodeWriter";

export default class XMLDocumentFragmentWriter extends XMLNodeWriter {
  constructor(next?: XMLNodeVisitor | null) {
    super(next, window.document.implementation.createDocument(null, null).createDocumentFragment());
  }
}