import XMLNodeVisitor from "./visitor/XMLNodeVisitor";

export interface KTMLIndex {
  footnotes: { [key: string]: number };
  footAnchors: { [key: string]: string[] };
}

export default class KTMLPostProcessor extends XMLNodeVisitor {
  index: KTMLIndex;
  tagName?: string;
  parent?: KTMLPostProcessor;

  constructor(visitor: XMLNodeVisitor | null, parent: KTMLPostProcessor | null | undefined) {
    super(visitor);
    this.parent = parent ?? undefined;
    this.index = parent?.index ?? { footnotes: {}, footAnchors: {} };
  }

  visitElement(namespaceURI: string | null, qualifiedName: string): XMLNodeVisitor | null {
    this.tagName = qualifiedName;
    return new KTMLPostProcessor(super.visitElement(namespaceURI, qualifiedName), this);
  }

  visitAttribute(namespace: string | null, qualifiedName: string, value: string): void {
    super.visitAttribute(namespace, qualifiedName, value);

    if (this.parent?.tagName === 'fnote' && qualifiedName === 'id') {
      const count = Object.entries(this.index.footnotes).length;
      this.index.footnotes[value] = count;
    }

    if (this.parent?.tagName === 'fa' && qualifiedName === 'ref') {
      this.index.footAnchors[value] ??= [];
      const count = this.index.footAnchors[value].length;
      const id = `${value}-${count}`;
      // super.visitAttribute(null, 'id', id);
      this.index.footAnchors[value].push(id);
    }
  }

  getIndex(): KTMLIndex {
    return this.index;
  }
}