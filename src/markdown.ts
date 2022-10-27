import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import { unified } from "unified";
import * as unist from "unist";
import * as mdast from "mdast";
import { readFileUTF8 } from "./utils.js";
import window from "@k0michi/isomorphic-dom";
import crypto from "crypto";
import { toISOStringJST } from "./date-format.js";

export async function toKTML(source: string) {
  const dom = await toDOM(source) as HTMLElement;
  let title;
  let h1 = dom.querySelector('h1');

  if (h1 != null) {
    title = h1.textContent;
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

export function toDOM(source: string) {
  const parsed = unified()
    .use(remarkParse)
    .use(remarkMath)
    .parse(source);

  const document = window.document.implementation.createDocument(null, 'ktml');
  return transformToDOM(parsed, document);
}

export function transformToDOM(node: unist.Node, document: Document) {
  if (node.type == 'root') {
    const root = node as mdast.Root;
    const element = document.createDocumentFragment();

    for (const child of root.children) {
      element.appendChild(transformToDOM(child, document));
    }

    return element;
  } else if (node.type == 'heading') {
    const heading = node as mdast.Heading;
    const element = document.createElement('h' + heading.depth);

    for (const child of heading.children) {
      element.appendChild(transformToDOM(child, document));
    }

    return element;
  } else if (node.type == 'paragraph') {
    const paragraph = node as mdast.Paragraph;
    const element = document.createElement('p');

    for (const child of paragraph.children) {
      element.appendChild(transformToDOM(child, document));
    }

    return element;
  } else if (node.type == 'link') {
    const link = node as mdast.Link;
    const element = document.createElement('a');
    element.setAttribute('href', link.url);

    for (const child of link.children) {
      element.appendChild(transformToDOM(child, document));
    }

    return element;
  } else if (node.type == 'inlineCode') {
    const inlineCode = node as mdast.InlineCode;
    const element = document.createElement('code');
    element.append(inlineCode.value);
    return element;
  } else if (node.type == 'text') {
    const text = node as mdast.Text;
    return document.createTextNode(text.value);
  }

  throw new Error(`Type ${node.type} is not supported`);
}