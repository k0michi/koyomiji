import window from "@k0michi/isomorphic-dom";
import XMLNodeVisitor from "./XMLNodeVisitor";
import XMLNodeWriter from "./XMLNodeWriter";
import XMLFragmentWriter from "./XMLFragmentWriter";
import XMLHelper from "./XMLHelper";

export default class XMLFragmentSerializer extends XMLFragmentWriter {
  constructor(next?: XMLNodeVisitor | null) {
    super(next);
  }

  toString() {
    return XMLHelper.serialize(this.container);
  }
}