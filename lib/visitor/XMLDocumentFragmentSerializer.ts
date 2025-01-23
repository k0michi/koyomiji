import window from "@k0michi/isomorphic-dom";
import XMLNodeVisitor from "./XMLNodeVisitor";
import XMLNodeWriter from "./XMLNodeWriter";
import XMLDocumentFragmentWriter from "./XMLDocumentFragmentWriter";
import XMLHelper from "./XMLHelper";

export default class XMLDocumentFragmentSerializer extends XMLDocumentFragmentWriter {
  constructor(next?: XMLNodeVisitor | null) {
    super(next);
  }

  toString() {
    return XMLHelper.serialize(this.container);
  }
}