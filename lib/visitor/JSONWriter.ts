import { JSONContainer, JSONValue } from "./JSON.index";
import JSONVisitor from "./JSONVisitor";

export default class JSONWriter extends JSONVisitor {
  container?: JSONContainer;
  rootValue?: JSONValue;

  constructor(next?: JSONVisitor | null, container?: JSONContainer) {
    super(next);
    this.container = container;
  }

  #set(key: string | number | null, value: JSONValue) {
    if (this.container) {
      if (Array.isArray(this.container)) {
        if (typeof (key) === 'number') {
          this.container[key] = value;
        } else {
          throw new Error(`Wrong arguments`);
        }
      } else {
        if (typeof (key) === 'string') {
          this.container[key] = value;
        } else {
          throw new Error(`Wrong arguments`);
        }
      }
    } else {
      this.rootValue = value;
    }
  }

  #get() {
    return this.container ? this.container : this.rootValue;
  }

  visitObject(key: string | number | null): JSONVisitor | null {
    const ob = {};
    this.#set(key, ob);
    return new JSONWriter(super.visitObject(key), ob);
  }

  visitArray(key: string | number | null): JSONVisitor | null {
    const ar: JSONValue[] = [];
    this.#set(key, ar);
    return new JSONWriter(super.visitArray(key), ar);
  }

  visitString(key: string | number | null, value: string) {
    this.#set(key, value);
    super.visitString(key, value);
  }

  visitNumber(key: string | number | null, value: number) {
    this.#set(key, value);
    super.visitNumber(key, value);
  }

  visitBoolean(key: string | number | null, value: boolean) {
    this.#set(key, value);
    super.visitBoolean(key, value);
  }

  visitNull(key: string | number | null) {
    this.#set(key, null);
    super.visitNull(key);
  }

  toString() {
    return JSON.stringify(this.#get());
  }

  toObject() {
    return structuredClone(this.#get());
  }
}