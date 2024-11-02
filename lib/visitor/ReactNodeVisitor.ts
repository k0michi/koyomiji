import type { ComponentClass, FunctionComponent, Key } from "react";

export default class ReactNodeVisitor {
  next: ReactNodeVisitor | null;

  constructor(next?: ReactNodeVisitor | null) {
    this.next = next ?? null;
  }

  visitElement<P extends {}>(type: FunctionComponent<P> | ComponentClass<P> | string): ReactNodeVisitor | null {
    return this.next?.visitElement(type) ?? null;
  }

  visitProp(key: string, value: any) {
    this.next?.visitProp(key, value);
  }

  visitString(value: string) {
    this.next?.visitString(value);
  }

  visitNumber(value: number) {
    this.next?.visitNumber(value);
  }

  visitArray(): ReactNodeVisitor | null {
    return this.next?.visitArray() ?? null;
  }

  visitPortal(container: Element | DocumentFragment,
    key?: Key | null): ReactNodeVisitor | null {
    return this.next?.visitPortal(container, key) ?? null;
  }

  visitBoolean(value: boolean) {
    this.next?.visitBoolean(value);
  }

  visitNull() {
    this.next?.visitNull();
  }

  visitUndefined() {
    this.next?.visitUndefined();
  }

  visitEnd() {
    this.next?.visitEnd();
  }
}