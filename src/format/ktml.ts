import window from '@k0michi/isomorphic-dom';
import path from 'path';
import { ArticleDocument } from '../document.js';
import { getTextContent, parseXML, parseXMLFragment, serializeXML } from '../xml.js';

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

export function createDocument(entryPath: string, source: string): ArticleDocument {
  const $document = parseXML(source);
  const $head = $document.querySelector('head') as Element;
  const title = getTextContent('title', $head)!;
  const id = getTextContent('id', $head)!;
  const created = getTextContent('created', $head)!;
  const modified = getTextContent('modified', $head) ?? created;
  let sourceStr = getTextContent('source', $head);

  if (source != undefined) {
    source = path.posix.join(entryPath, source);
  }

  const $body = $document.querySelector('body')!;
  validate($body.outerHTML);

  const description = getDescription($body, 120);
  const content = $body.outerHTML;

  return { type: 'article', title, id, created, modified, description, path: entryPath, source: sourceStr, content };
}

// Fix img path to absolute path
function transformImg(element: Element, basePath: string) {
  const document = element.ownerDocument!;

  for (const img of element.querySelectorAll('img')) {
    const relativeSrc = img.getAttribute('src');
    const absoluteSrc = path.posix.join(basePath, relativeSrc!);
    img.setAttribute('src', absoluteSrc);
  }
}

export function transformPaths(doc: ArticleDocument) {
  const $document = parseXML(doc.content!);
  transformImg($document.documentElement, doc.path);
  const serialized = serializeXML($document);
  const transformed = { ...doc, content: serialized };
  return transformed as ArticleDocument;
}

export function validate(source: string) {
  const $document = parseXMLFragment(source);
  validateNode($document);
}

function validationAssert(condition: boolean) {
  if (!condition) {
    throw new Error('Validation failed');
  }
}

function validateNode(node: Node) {
  if (node.nodeType == window.Node.ELEMENT_NODE) {
    const element = node as Element;
    const tag = element.tagName;

    if (tag == 'p') {
      validationAssert(element.attributes.length == 0);
    } else if (tag == 'h1' || tag == 'h2' || tag == 'h3' || tag == 'h4' || tag == 'h5' || tag == 'h6') {
      validationAssert(element.attributes.length == 0);
    } else if (tag == 'hr') {
      validationAssert(element.attributes.length == 0);
    } else if (tag == 'blockquote') {
      validationAssert(element.attributes.length == 0);
    } else if (tag == 'ul' || tag == 'ol') {
      validationAssert(element.attributes.length == 0);
    } else if (tag == 'li') {
      validationAssert(element.attributes.length == 0);
    } else if (tag == 'inline-code') {
      for (const a of element.attributes) {
        validationAssert(a.name == 'lang');
      }
    } else if (tag == 'code') {
      for (const a of element.attributes) {
        validationAssert(a.name == 'lang' || a.name == 'title');
      }
    } else if (tag == 'i') {
      validationAssert(element.attributes.length == 0);
    } else if (tag == 'b') {
      validationAssert(element.attributes.length == 0);
    } else if (tag == 's') {
      validationAssert(element.attributes.length == 0);
    } else if (tag == 'u') {
      validationAssert(element.attributes.length == 0);
    } else if (tag == 'br') {
      validationAssert(element.attributes.length == 0);
    } else if (tag == 'a') {
      for (const a of element.attributes) {
        validationAssert(a.name == 'href' || a.name == 'title');
      }
    } else if (tag == 'img') {
      for (const a of element.attributes) {
        validationAssert(a.name == 'src' || a.name == 'alt' || a.name == 'title');
      }
    } else if (tag == 'inline-math') {
      validationAssert(element.attributes.length == 0);
    } else if (tag == 'math') {
      validationAssert(element.attributes.length == 0);
    } else if (tag == 'table') {
      validationAssert(element.attributes.length == 0);
    } else if (tag == 'tr') {
      validationAssert(element.attributes.length == 0);
    } else if (tag == 'td') {
      validationAssert(element.attributes.length == 0);
    } else if (tag == 'thead') {
      validationAssert(element.attributes.length == 0);
    } else if (tag == 'tbody') {
      validationAssert(element.attributes.length == 0);
    } else if (tag == 'body') {
      // TODO: Remove body element
      validationAssert(element.attributes.length == 0);
    } else if (tag == 'section') {
      validationAssert(element.attributes.length == 0);
    } else {
      throw new Error('Unsupported element');
    }
  }

  for (const c of node.childNodes) {
    validateNode(c);
  }
}