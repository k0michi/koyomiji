import ReactNodeVisitor from "./visitor/ReactNodeVisitor";
import XMLNodeVisitor from "./visitor/XMLNodeVisitor";
import { Link } from "react-router";
import Math from "components/math";
import Code from "components/code";
import Image from "components/image";
import NullableHelper from "./NullableHelper";

export default class KTMLReactTransformer extends XMLNodeVisitor {
  nextReact: ReactNodeVisitor | null;

  constructor(nextReact: ReactNodeVisitor | null | undefined) {
    super(null);
    this.nextReact = nextReact ?? null;
  }

  splitQualified(qualifiedName: string) {
    const split = qualifiedName.split(':');
    const prefix = split.at(-2);
    let local = split.at(-1);
    local = NullableHelper.unwrap(local);
    return {
      prefix,
      local
    };
  }

  visitElement(namespaceURI: string | null, qualifiedName: string): XMLNodeVisitor | null {
    const split = this.splitQualified(qualifiedName);

    switch (split.local) {
      case 'blockmath':
        const bm = this.nextReact?.visitElement(Math);
        bm?.visitProp('display', 'block');
        return new KTMLReactTransformer(bm);
      case 'math':
        return new KTMLReactTransformer(this.nextReact?.visitElement(Math));
      case 'blockcode':
        const bc = this.nextReact?.visitElement(Code);
        bc?.visitProp('display', 'block');
        return new KTMLReactTransformer(bc);
      case 'code':
        return new KTMLReactTransformer(this.nextReact?.visitElement(Code));
      case 'a':
        return new KTMLReactTransformerA(this.nextReact?.visitElement(Link));
      case 'img':
        const imgNode = this.nextReact?.visitElement(Image);
        imgNode?.visitProp('loading', 'lazy');
        return new KTMLReactTransformer(imgNode);
      // Prevents ` Whitespace text nodes cannot appear as a child of <table>. Make sure you don't have any extra whitespace between tags on each line of your source code.`
      // isTagValidWithParent
      case 'tr':
      case 'tbody':
      case 'thead':
      case 'tfoot':
      case 'table':
        return new KTMLReactTransformerNoText(this.nextReact?.visitElement(split.local));
    }

    return new KTMLReactTransformer(this.nextReact?.visitElement(split.local));
  }

  visitAttribute(namespace: string | null, qualifiedName: string, value: string): void {
    const split = this.splitQualified(qualifiedName);
    this.nextReact?.visitProp(split.local, value);
  }

  visitAttributeEnd(): void {
    this.nextReact?.visitPropEnd();
  }

  visitTextNode(data: string): void {
    this.nextReact?.visitString(data);
  }

  visitCDATASection(data: string): void {
    this.nextReact?.visitString(data);
  }

  visitProcessingInstruction(target: string, data: string): void {
  }

  visitComment(data: string): void {
  }

  visitDocumentType(qualifiedName: string, publicId: string, systemId: string): void {
  }

  visitEnd(): void {
    this.nextReact?.visitEnd();
  }
}

export class KTMLReactTransformerA extends KTMLReactTransformer {
  constructor(nextReact?: ReactNodeVisitor | null) {
    super(nextReact ?? null);
  }

  visitAttribute(namespace: string | null, qualifiedName: string, value: string): void {
    const split = this.splitQualified(qualifiedName);
    let key = split.local;

    switch (key) {
      case 'ref':
        key = 'to';
        break;
    }

    this.nextReact?.visitProp(key, value);
  }
}

export class KTMLReactTransformerNoText extends KTMLReactTransformer {
  constructor(nextReact?: ReactNodeVisitor | null) {
    super(nextReact ?? null);
  }

  visitTextNode(data: string): void {
  }

  visitCDATASection(data: string): void {
  }
}