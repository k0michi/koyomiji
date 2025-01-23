import { JSONContainer } from "./JSON.index";
import JSONVisitor from "./JSONVisitor";
import JSONWriter from "./JSONWriter";

export default class JSONSerializer extends JSONWriter {
  constructor(next?: JSONVisitor | null, container?: JSONContainer) {
    super(next, container);
  }

  toString() {
    return JSON.stringify(this._getRoot());
  }
}