import window from '@k0michi/isomorphic-dom';

export const Fragment = Symbol('Fragment');

export function parseXML(string: string) {
  const parser = new window.DOMParser();
  const $document = parser.parseFromString(string, 'text/xml');

  if (($document.firstChild as Element).tagName == 'parsererror') {
    throw new Error('Failed to parse');
  }

  return $document;
}

export function getDescription(node: Node, limit: number) {
  const Node = window.Node;

  if (node.nodeType == Node.TEXT_NODE) {
    const text = node as Text;
    return text.data;
  } else {
    let desc = '';

    for (const childNode of node.childNodes) {
      desc += getDescription(childNode, limit).trimStart();

      if (desc.length > limit) {
        desc = desc.substring(0, limit) + '…';
        break;
      }
    }

    return desc;
  }
}

export function transformImg(element: Element, basePath: string[]) {
  const document = element.ownerDocument!;

  for (const img of element.querySelectorAll('img')) {
    const relativeSrc = img.getAttribute('src');
    const absoluteSrc = resolvePath(basePath, relativeSrc!);
    img.setAttribute('src', absoluteSrc);
  }
}

export function resolvePath(p1: string[], p2: string) {
  return '/' + p1.join('/') + '/' + p2;
}

export function transformMath(element: Element) {
  for (const math of element.querySelectorAll('math')) {
    const parentTag = (math.parentNode as Element).tagName;

    if (isContainerBlock(parentTag)) {
      math.setAttribute('display', 'block');
    } else {
      math.setAttribute('display', 'inline');
    }
  }
}

export function transformCode(element: Element) {
  for (const code of element.querySelectorAll('code')) {
    const parentTag = (code.parentNode as Element).tagName;

    if (isContainerBlock(parentTag)) {
      code.setAttribute('display', 'block');
    } else {
      code.setAttribute('display', 'inline');
    }
  }
}

export function isContainerBlock(tagName: string) {
  return tagName == 'body';
}

export function toElement<T>(node: Node | NodeList, factory: (type: any, props: any, ...children: any[]) => T): string | T {
  const Node = window.Node;

  if ((node as any).nodeType != null) {
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