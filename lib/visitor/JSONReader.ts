import { JSONValue } from "./JSON.index";
import JSONVisitor from "./JSONVisitor";

export default class JSONReader {
  value: JSONValue;

  constructor(value: JSONValue) {
    this.value = value;
  }

  static fromString(string: string) {
    return new JSONReader(JSON.parse(string));
  }

  #acceptValue(visitor: JSONVisitor, key: string | number | null, value: JSONValue) {
    switch (typeof (value)) {
      case "string":
        visitor.visitString(key, value);
        break;
      case "number":
        visitor.visitNumber(key, value);
        break;
      case "boolean":
        visitor.visitBoolean(key, value);
        break;
      case "object":
        if (value === null) {
          visitor.visitNull(key);
        } else if (Array.isArray(value)) {
          const arVisitor = visitor.visitArray(key);

          if (arVisitor) {
            for (let i = 0; i < value.length; i++) {
              this.#acceptValue(arVisitor, i, value[i]);
            }

            arVisitor.visitEnd();
          }
        } else {
          const obVisitor = visitor.visitObject(key);

          if (obVisitor) {
            for (const [k, v] of Object.entries(value)) {
              this.#acceptValue(obVisitor, k, v);
            }

            obVisitor.visitEnd();
          }
        }
        break;
      default:
    }

    visitor.visitEnd();
  }

  accept(visitor: JSONVisitor) {
    this.#acceptValue(visitor, null, this.value);
  }
}