import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import { unified } from "unified";
import type * as unist from "unist";
import type * as mdast from "mdast";
import * as mdastMath from "mdast-util-math";
import window from "@k0michi/isomorphic-dom";
import crypto from "crypto";
import { toISOStringJST } from "../lib/date-format";
import XMLHelper from "./visitor/XMLHelper";

// FIXME
export async function toKTML(source: string) {
  const dom = toDOM(source) as HTMLElement;
  let title;
  let h1 = dom.querySelector('h1');

  if (h1 != null) {
    title = h1.textContent;
    title = title?.replace('<', '&lt;');
    title = title?.replace('>', '&gt;');
    h1.parentNode?.removeChild(h1);
  }

  const serializer = new window.XMLSerializer();
  const xml = serializer.serializeToString(dom);

  return `<ktml version="0.1">

<head>
  <title>${title}</title>
  <id>${crypto.randomUUID()}</id>
  <created>${toISOStringJST(new Date())}</created>
</head>

<body>
  ${xml}
</body>

</ktml>`;
}

function parse(string: string) {
  return unified()
    .use(remarkParse)
    .use(remarkMath)
    .parse(string);
}

export function toDOM(source: string) {
  const document = window.document.implementation.createDocument(null, 'ktml');
  return transformToDOM(parse(source), document);
}

function transformChildren(node: unist.Parent, parent: Element | DocumentFragment) {
  for (const child of node.children) {
    parent.appendChild(transformToDOM(child, parent.ownerDocument));
  }
}

export function transformToDOM(node: unist.Node, document: Document): Node {
  if (node.type == 'root') {
    const root = node as mdast.Root;
    const element = document.createDocumentFragment();
    transformChildren(root, element);
    return element;
  } else if (node.type == 'paragraph') {
    const paragraph = node as mdast.Paragraph;
    const element = document.createElement('p');
    transformChildren(paragraph, element);
    return element;
  } else if (node.type == 'heading') {
    const heading = node as mdast.Heading;
    const element = document.createElement('h' + heading.depth);
    transformChildren(heading, element);
    return element;
  } else if (node.type == 'thematicBreak') {
    const element = document.createElement('hr');
    return element;
  } else if (node.type == 'blockquote') {
    const blockquote = node as mdast.Blockquote;
    // This may change in the future
    const element = document.createElement('blockquote');
    transformChildren(blockquote, element);
    return element;
  } else if (node.type == 'list') {
    const list = node as mdast.List;
    const element = document.createElement(list.ordered ? 'ol' : 'ul');
    transformChildren(list, element);
    return element;
  } else if (node.type == 'listItem') {
    const listItem = node as mdast.ListItem;
    const element = document.createElement('li');
    transformChildren(listItem, element);
    return element;
  } else if (node.type == 'code') {
    const code = node as mdast.Code;
    const element = document.createElement('code');

    if (code.lang != undefined) {
      element.setAttribute('lang', code.lang);
    }

    element.append(code.value);
    return element;
    // } else if (node.type == 'definition') {
  } else if (node.type == 'text') {
    const text = node as mdast.Text;
    return document.createTextNode(text.value);
  } else if (node.type == 'emphasis') {
    const emphasis = node as mdast.Emphasis;
    const element = document.createElement('i');
    transformChildren(emphasis, element);
    return element;
  } else if (node.type == 'strong') {
    const strong = node as mdast.Strong;
    const element = document.createElement('b');
    transformChildren(strong, element);
    return element;
  } else if (node.type == 'inlineCode') {
    const inlineCode = node as mdast.InlineCode;
    const element = document.createElement('code');
    element.append(inlineCode.value);
    return element;
  } else if (node.type == 'break') {
    const element = document.createElement('br');
    return element;
  } else if (node.type == 'link') {
    const link = node as mdast.Link;
    const element = document.createElement('a');
    element.setAttribute('href', link.url);
    transformChildren(link, element);
    return element;
  } else if (node.type == 'image') {
    const image = node as mdast.Image;
    const element = document.createElement('img');
    element.setAttribute('src', image.url);
    return element;
    // } else if (node.type == 'linkReference') {
    // } else if (node.type == 'imageReference') {
  } else if (node.type == 'math') {
    const math = node as mdastMath.Math;
    const element = document.createElement('math');
    element.append(math.value);
    return element;
  } else if (node.type == 'inlineMath') {
    const inlineMath = node as mdastMath.InlineMath;
    const element = document.createElement('math');
    element.append(inlineMath.value);
    return element;
  } else if (node.type == 'html') {
    const html = node as mdast.Html;
    const parsed = XMLHelper.parseFragment(html.value);
    // const element = document.createElement(parsed.firstElementChild!.tagName);
    // const parsedMD = parse(parsed.firstElementChild!.innerHTML);
    // transformChildren(parsedMD, element);
    return parsed;
  }

  throw new Error(`Type ${node.type} is not supported`);
}