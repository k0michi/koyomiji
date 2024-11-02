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
      case 'math':
        return new KTMLReactTransformer(this.nextReact?.visitElement(Math));
      case 'code':
        return new KTMLReactTransformer(this.nextReact?.visitElement(Code));
      case 'a':
        return new KTMLReactTransformerA(this.nextReact?.visitElement(Link));
      case 'img':
        return new KTMLReactTransformer(this.nextReact?.visitElement(Image));
      // Prevents ` Whitespace text nodes cannot appear as a child of <table>. Make sure you don't have any extra whitespace between tags on each line of your source code.`
      case 'table':
        return new KTMLReactTransformerTable(this.nextReact?.visitElement('table'));
      case 'tbody':
        return new KTMLReactTransformerTBody(this.nextReact?.visitElement('tbody'));
      case 'tr':
        return new KTMLReactTransformerTR(this.nextReact?.visitElement('tr'));
    }

    return new KTMLReactTransformer(this.nextReact?.visitElement(split.local));
  }

  visitAttribute(namespace: string | null, qualifiedName: string, value: string): void {
    const split = this.splitQualified(qualifiedName);
    this.nextReact?.visitProp(split.local, value);
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
      case 'href':
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

export class KTMLReactTransformerTable extends KTMLReactTransformerNoText {
  constructor(nextReact?: ReactNodeVisitor | null) {
    super(nextReact ?? null);
  }
}

export class KTMLReactTransformerTBody extends KTMLReactTransformerNoText {
  constructor(nextReact?: ReactNodeVisitor | null) {
    super(nextReact ?? null);
  }
}

export class KTMLReactTransformerTR extends KTMLReactTransformerNoText {
  constructor(nextReact?: ReactNodeVisitor | null) {
    super(nextReact ?? null);
  }
}