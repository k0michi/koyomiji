import window from '@k0michi/isomorphic-dom';
import path from 'path';
import { Entry } from './entry';
import { getTextContent, parseXML } from './xml.js';

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

export function transformImg(element: Element, basePath: string) {
  const document = element.ownerDocument!;

  for (const img of element.querySelectorAll('img')) {
    const relativeSrc = img.getAttribute('src');
    const absoluteSrc = path.posix.join(basePath, relativeSrc!);
    img.setAttribute('src', absoluteSrc);
  }
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
  return tagName == 'body' || tagName == 'li';
}

export function preprocess(entryPath: string, content: string): Entry {
  const $document = parseXML(content);
  const $head = $document.querySelector('head') as Element;
  const title = getTextContent('title', $head)!;
  const id = getTextContent('id', $head)!;
  const created = getTextContent('created', $head)!;
  const modified = getTextContent('modified', $head) ?? created;
  let source = getTextContent('source', $head);

  if (source != undefined) {
    source = path.posix.join(entryPath, source);
  }

  const $body = $document.querySelector('body')!;
  transformMath($body);
  transformCode($body);
  transformImg($body, entryPath);
  const description = getDescription($body, 120);
  return { title, id, created, modified, description, path: entryPath, source, content: $body.outerHTML };
}