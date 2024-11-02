import { FunctionComponent, ComponentClass, ReactNode, Key } from "react";
import ReactNodeVisitor from "./ReactNodeVisitor";
import ReactMutableNode from "./ReactMutableNode";

export default class ReactNodeWriter extends ReactNodeVisitor {
  container: ReactMutableNode;

  constructor(next: ReactNodeVisitor | null | undefined, container: ReactMutableNode) {
    super(next);
    this.container = container;
  }

  visitElement<P extends {}>(type: FunctionComponent<P> | ComponentClass<P> | string): ReactNodeVisitor | null {
    const el = ReactMutableNode.createElement(type);
    this.container.appendChild(el);
    return new ReactNodeWriter(super.visitElement(type), el);
  }

  visitProp(key: string, value: any): void {
    this.container.setProp(key, value);
    super.visitProp(key, value);
  }

  visitString(value: string): void {
    this.container.appendChild(ReactMutableNode.createString(value));
    super.visitString(value);
  }

  visitNumber(value: number): void {
    this.container.appendChild(ReactMutableNode.createNumber(value));
    super.visitNumber(value);
  }

  visitArray(): ReactNodeVisitor | null {
    const ar = ReactMutableNode.createArray();
    this.container.appendChild(ar);
    return new ReactNodeWriter(super.visitArray(), ar);
  }

  visitPortal(container: Element | DocumentFragment, key?: Key | null): ReactNodeVisitor | null {
    const po = ReactMutableNode.createPortal(container, key);
    this.container.appendChild(po);
    return new ReactNodeWriter(super.visitArray(), po);
  }

  visitBoolean(value: boolean): void {
    this.container.appendChild(ReactMutableNode.createBoolean(value));
    super.visitBoolean(value);
  }

  visitNull(): void {
    this.container.appendChild(ReactMutableNode.createNull());
    super.visitNull();
  }

  visitUndefined(): void {
    this.container.appendChild(ReactMutableNode.createUndefined());
    super.visitUndefined();
  }

  toReactNode() {
    return this.container.toReactNode();
  }
}