import React, { ComponentClass, FunctionComponent, Key, ReactNode } from "react";
import * as ReactDOM from 'react-dom';

export enum ReactNodeType {
  element,
  string,
  number,
  array,
  portal,
  boolean,
  null,
  undefined,
}

export default class ReactMutableNode {
  type: ReactNodeType;

  elementType?: FunctionComponent | ComponentClass | string;
  stringValue?: string;
  numberValue?: number;
  portalContainer?: Element | DocumentFragment;
  portalKey?: Key | null;
  booleanValue?: boolean;

  props: { [key: string]: any } = {};
  children: ReactMutableNode[] = [];

  constructor(type: ReactNodeType) {
    this.type = type;
  }

  static createElement(type: FunctionComponent | ComponentClass | string) {
    const node = new ReactMutableNode(ReactNodeType.element);
    node.elementType = type;
    return node;
  }

  static createString(value: string) {
    const node = new ReactMutableNode(ReactNodeType.string);
    node.stringValue = value;
    return node;
  }

  static createNumber(value: number) {
    const node = new ReactMutableNode(ReactNodeType.number);
    node.numberValue = value;
    return node;
  }

  static createArray() {
    const node = new ReactMutableNode(ReactNodeType.array);
    return node;
  }

  static createPortal(container: Element | DocumentFragment,
    key?: Key | null) {
    const node = new ReactMutableNode(ReactNodeType.portal);
    node.portalContainer = container;
    node.portalKey = key;
    return node;
  }

  static createBoolean(value: boolean) {
    const node = new ReactMutableNode(ReactNodeType.boolean);
    node.booleanValue = value;
    return node;
  }

  static createNull() {
    const node = new ReactMutableNode(ReactNodeType.null);
    return node;
  }

  static createUndefined() {
    const node = new ReactMutableNode(ReactNodeType.undefined);
    return node;
  }

  appendChild(node: ReactMutableNode) {
    this.children.push(node);
  }

  setProp(key: string, value: string) {
    this.props[key] = value;
  }

  toReactNode(): ReactNode {
    const childReactNodes = [];

    for (const c of this.children) {
      childReactNodes.push(c.toReactNode());
    }

    switch (this.type) {
      case ReactNodeType.element:
        return React.createElement(this.elementType!, this.props, ...childReactNodes);
      case ReactNodeType.string:
        return this.stringValue!;
      case ReactNodeType.number:
        return this.numberValue!;
      case ReactNodeType.array:
        return childReactNodes;
      case ReactNodeType.portal:
        return ReactDOM.createPortal(childReactNodes[0], this.portalContainer!, this.portalKey);
      case ReactNodeType.boolean:
        return this.booleanValue!;
      case ReactNodeType.null:
        return null;
      case ReactNodeType.undefined:
        return undefined;
    }
  }
}