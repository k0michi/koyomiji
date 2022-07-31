import { JSDOM } from "jsdom";
import * as React from 'react';

const jsdom = new JSDOM();

export function parseXML(string: string) {
  const parser = new jsdom.window.DOMParser();
  const $document = parser.parseFromString(string, 'text/xml');

  if (($document.firstChild as Element).tagName == 'parsererror') {
    throw new Error('Failed to parse');
  }

  return $document;
}

export function getDescription(node: Node, limit: number) {
  const Node = jsdom.window.Node;

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

export function transformMath(element: Element) {
  const document = element.ownerDocument!;

  for (const math of element.querySelectorAll('math')) {
    const parentTag = (math.parentNode as Element).tagName;

    if (isContainerBlock(parentTag)) {
      const mathDiv = document.createElement('div');
      mathDiv.className = 'math-block';
      mathDiv.textContent = math.textContent;
      math.parentNode?.replaceChild(mathDiv, math);
    } else {
      const mathSpan = document.createElement('span');
      mathSpan.className = 'math-inline';
      mathSpan.textContent = math.textContent;
      math.parentNode?.replaceChild(mathSpan, math);
    }
  }
}

export function transformCode(element: Element) {
  const document = element.ownerDocument!;

  for (const code of element.querySelectorAll('code')) {
    const parentTag = (code.parentNode as Element).tagName;
    const lang = code.getAttribute('lang') ?? '';
    code.removeAttribute('lang');

    if (lang != null) {
      code.className = `language-${lang}`;
    }

    if (isContainerBlock(parentTag)) {
      const pre = document.createElement('pre');

      if (lang != null) {
        pre.className = `language-${lang}`;
      }

      code.parentNode?.replaceChild(pre, code);
      pre.appendChild(code);
    }
  }
}

export function isContainerBlock(tagName: string) {
  return tagName == 'body';
}

export function toElement(node: Node | NodeList): any {
  const Node = jsdom.window.Node;

  if ((node as any).nodeType != null) {
    node = node as Node;

    if (node.nodeType == Node.DOCUMENT_NODE) {
      return toElement(node.childNodes);
    } else if (node.nodeType == Node.ELEMENT_NODE) {
      const element = node as Element;
      const children = [];
      children.length = node.childNodes.length;

      for (let i = 0; i < node.childNodes.length; i++) {
        children[i] = toElement(node.childNodes[i]);
      }

      const props: any = {};

      for (let i = 0; i < element.attributes.length; i++) {
        props[element.attributes[i].name] = element.attributes[i].value;
      }

      const tag = element.tagName.toLowerCase();

      return React.createElement(tag, props, ...children);
    } else if (node.nodeType == Node.TEXT_NODE) {
      const text = node as Text;
      return text.data;
    }
  } else {
    node = node as NodeList;
    const children = [];
    children.length = node.length;

    for (let i = 0; i < node.length; i++) {
      children[i] = toElement(node[i]);
    }

    return React.createElement(React.Fragment, {}, ...children);
  }
}

export function getTextContent(query: string, $element: any) {
  if ($element == null) {
    return null;
  }

  const $found = $element.querySelector(query, $element);

  if ($found == null) {
    return null;
  }

  return $found.textContent;
}