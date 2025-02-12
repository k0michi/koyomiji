import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import { unified } from "unified";
import type * as unist from "unist";
import type * as mdast from "mdast";
import * as mdastMath from "mdast-util-math";
import window from "@k0michi/isomorphic-dom";
import crypto from "crypto";
import { toISOStringJST } from "./DateFormat.index";
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
  const now = new Date();

  return `<?xml version="1.0" encoding="UTF-8"?>
<ktml version="0.1">

<head>
  <title>${title}</title>
  <id>${crypto.randomUUID()}</id>
  <created>${toISOStringJST(now)}</created>
  <modified>${toISOStringJST(now)}</modified>
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
  const children: (string | Node)[] = [];
  let hasRaw = false;

  for (const child of node.children) {
    const transformed = transformToDOM(child, parent.ownerDocument);
    children.push(transformed);

    if (typeof (transformed) === 'string') {
      hasRaw = true;
    }
  }

  if (hasRaw) {
    let result = '';

    for (const c of children) {
      if (typeof (c) === 'string') {
        result += c;
      } else {
        result += XMLHelper.serialize(c);
      }
    }

    const parsed = XMLHelper.parseFragment(result);

    while (parsed.firstChild) {
      parent.appendChild(parsed.firstChild);
    }
  } else {
    for (const c of children as Node[]) {
      parent.appendChild(c);
    }
  }
}

export function transformToDOM(node: unist.Node, document: Document): Node | string {
  if (node.type == 'root') {
    const root = node as mdast.Root;
    const element = document.createDocumentFragment();
    transformChildren(root, element);
    return element;
  } else if (node.type == 'paragraph') {
    const paragraph = node as mdast.Paragraph;
    const element = document.createElement('p');
    transformChildren(paragraph, element);

    if (element.childElementCount === 1 && element.firstElementChild?.tagName === 'img') {
      return element.firstElementChild;
    }

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
    const element = document.createElement('blockcode');
    const $cdata = document.createCDATASection(code.value);
    element.append($cdata);

    if (code.lang != undefined) {
      if (code.lang.includes(':')) {
        const split = code.lang.split(':');
        if (split[0].length > 0) {
          element.setAttribute('lang', split[0]);
        }
        if (split[1].length > 0) {
          element.setAttribute('title', split[1]);
        }
      } else {
        element.setAttribute('lang', code.lang);
      }
    }

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
    const $cdata = document.createCDATASection(inlineCode.value);
    element.append($cdata);
    return element;
  } else if (node.type == 'break') {
    const element = document.createElement('br');
    return element;
  } else if (node.type == 'link') {
    const link = node as mdast.Link;
    const element = document.createElement('a');
    element.setAttribute('ref', link.url);
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
    const element = document.createElement('blockmath');
    const $cdata = document.createCDATASection(math.value);
    element.append($cdata);
    return element;
  } else if (node.type == 'inlineMath') {
    const inlineMath = node as mdastMath.InlineMath;
    const element = document.createElement('math');
    const $cdata = document.createCDATASection(inlineMath.value);
    element.append($cdata);
    return element;
  } else if (node.type == 'html') {
    const html = node as mdast.Html;
    return html.value;
    // const parsed = XMLHelper.parseFragment(html.value);

    // console.log([...parsed.childNodes])
    // for (const c of parsed.childNodes) {
    //   if (c.nodeType === window.Node.ELEMENT_NODE) {
    //     const el = (c as Element);
    //     console.log(el.innerHTML)
    //     const parsedMD = parse(el.innerHTML);

    //     while (el.firstChild) {
    //       el.firstChild.remove();
    //     }

    //     transformChildren(parsedMD, el);
    //   }
    // }

    // return parsed;
  }

  throw new Error(`Type ${node.type} is not supported`);
}