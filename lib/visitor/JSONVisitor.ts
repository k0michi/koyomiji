export default class JSONVisitor {
  next: JSONVisitor | null;

  constructor(next?: JSONVisitor | null) {
    this.next = next ?? null;
  }

  visitObject(key: string | number | null): JSONVisitor | null {
    return this.next?.visitObject(key) ?? null;
  }

  visitArray(key: string | number | null): JSONVisitor | null {
    return this.next?.visitArray(key) ?? null;
  }

  visitString(key: string | number | null, value: string) {
    this.next?.visitString(key, value);
  }

  visitNumber(key: string | number | null, value: number) {
    this.next?.visitNumber(key, value);
  }

  visitBoolean(key: string | number | null, value: boolean) {
    this.next?.visitBoolean(key, value);
  }

  visitNull(key: string | number | null) {
    this.next?.visitNull(key);
  }

  visitEnd() {
    this.next?.visitEnd();
  }
}