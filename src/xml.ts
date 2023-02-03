import window from '@k0michi/isomorphic-dom';

export const Fragment = Symbol('Fragment');

export function parseXML(string: string) {
  const parser = new window.DOMParser();
  const $document = parser.parseFromString(string, 'text/xml');

  if ($document.querySelector('parsererror') != null) {
    throw new Error('Failed to parse');
  }

  return $document;
}

export function parseXMLFragment(string: string) {
  const parser = new window.DOMParser();
  const $document = parser.parseFromString(`<root>${string}</root>`, 'text/xml');

  if ($document.querySelector('parsererror') != null) {
    throw new Error('Failed to parse');
  }

  const fragment = $document.createDocumentFragment();

  while ($document.documentElement.firstChild != null) {
    fragment.appendChild($document.documentElement.firstChild!);
  }

  return fragment;
}

export function serializeXML(node: Node) {
  const serializer = new window.XMLSerializer();
  return serializer.serializeToString(node);
}

export function getTextContent(query: string, $element: Element) {
  if ($element == null) {
    return undefined;
  }

  const $found = $element.querySelector(query);

  if ($found == null) {
    return undefined;
  }

  return $found.textContent!;
}

export function toElement<T>(node: Node | NodeList, factory: (type: Symbol | string, props: { [key: string]: string }, ...children: (string | T)[]) => T): string | T {
  const Node = window.Node;

  if (node instanceof Node) {
    node = node as Node;

    if (node.nodeType == Node.DOCUMENT_NODE) {
      return toElement(node.childNodes, factory);
    } else if (node.nodeType == Node.ELEMENT_NODE) {
      const element = node as Element;
      const children = [];
      children.length = node.childNodes.length;

      for (let i = 0; i < node.childNodes.length; i++) {
        children[i] = toElement(node.childNodes[i], factory);
      }

      const props: any = {};

      for (let i = 0; i < element.attributes.length; i++) {
        if (element.attributes[i].name == 'class') {
          props['className'] = element.attributes[i].value;
        } else {
          props[element.attributes[i].name] = element.attributes[i].value;
        }
      }

      const tag = element.tagName.toLowerCase();

      return factory(tag, props, ...children);
    } else if (node.nodeType == Node.TEXT_NODE) {
      const text = node as Text;
      return text.data;
    } else {
      throw new Error();
    }
  } else {
    node = node as NodeList;
    const children = [];
    children.length = node.length;

    for (let i = 0; i < node.length; i++) {
      children[i] = toElement(node[i], factory);
    }

    return factory(Fragment, {}, ...children);
  }
}

export function newElementCreator(document: Document, namespace: string) {
  return (type: string, props: Record<string, string> = {}, children?: string) => {
    const $elem = document.createElementNS(namespace, type);

    for (const [key, value] of Object.entries(props)) {
      $elem.setAttribute(key, value);
    }

    if (children != null) {
      $elem.append(children);
    }

    return $elem;
  };
}