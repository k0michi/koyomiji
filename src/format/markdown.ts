import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import { unified } from "unified";
import * as unist from "unist";
import * as mdast from "mdast";
import * as mdastMath from "mdast-util-math";
import crypto from "crypto";
import { toISOStringJST } from "../date-format.js";
import { parseXML, parseXMLFragment, serializeXML } from "../xml.js";
import * as xast from 'xast';
import { x } from 'xastscript';
import { u } from 'unist-builder';
import { toXml } from 'xast-util-to-xml';
import { validate } from "./ktml.js";

// FIX ME
export function toKTML(source: string) {
  let xml = toXml(parseToXast(source) as any, { allowDangerousXml: true });
  const dom = parseXMLFragment(xml);
  let title;
  let h1 = dom.querySelector('h1');

  if (h1 != null) {
    title = h1.textContent;
    h1.parentNode?.removeChild(h1);
  }

  xml = serializeXML(dom);
  validate(xml);

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

export function parseToXast(source: string) {
  const parsed = unified()
    .use(remarkParse)
    .use(remarkMath)
    .parse(source);

  return transformToXast(parsed);
}

export interface Raw extends xast.Literal {
  type: 'raw';
}

type XastNode = xast.Element | xast.Text | xast.Root | Raw;

// Temporal fix
function transformChildren(node: unist.Parent): any[] {
  const children = [];

  for (const child of node.children) {
    children.push(transformToXast(child));
  }

  return children;
}

export function transformToXast(node: unist.Node): XastNode {
  if (node.type == 'root') {
    const root = node as mdast.Root;
    const children = transformChildren(root);
    return x(null, children);
  } else if (node.type == 'paragraph') {
    const paragraph = node as mdast.Paragraph;
    const children = transformChildren(paragraph);
    return x('p', {}, children);
  } else if (node.type == 'heading') {
    const heading = node as mdast.Heading;
    const children = transformChildren(heading);
    return x('h' + heading.depth, {}, children);
  } else if (node.type == 'thematicBreak') {
    return x('hr', {}, []);
  } else if (node.type == 'blockquote') {
    const blockquote = node as mdast.Blockquote;
    // This may change in the future
    const children = transformChildren(blockquote);
    return x('blockquote', {}, children);
  } else if (node.type == 'list') {
    const list = node as mdast.List;
    const children = transformChildren(list);
    return x(list.ordered ? 'ol' : 'ul', {}, children);
  } else if (node.type == 'listItem') {
    const listItem = node as mdast.ListItem;
    const children = transformChildren(listItem);
    return x('li', {}, children);
  } else if (node.type == 'html') {
    const html = node as mdast.HTML;
    return u('raw', html.value);
  } else if (node.type == 'code') {
    const code = node as mdast.Code;
    const attributes: Record<string, string | undefined> = {};

    if (code.lang != undefined) {
      if (code.lang.includes(':')) {
        const split = code.lang.split(':');
        attributes['lang'] = split[0];
        attributes['title'] = split[1];
      } else {
        attributes['lang'] = code.lang;
      }
    }

    return x('code', attributes, [code.value]);
    // } else if (node.type == 'definition') {
  } else if (node.type == 'text') {
    const text = node as mdast.Text;
    return u('text', text.value);
  } else if (node.type == 'emphasis') {
    const emphasis = node as mdast.Emphasis;
    const children = transformChildren(emphasis);
    return x('i', {}, children);
  } else if (node.type == 'strong') {
    const strong = node as mdast.Strong;
    const children = transformChildren(strong);
    return x('b', {}, children);
  } else if (node.type == 'inlineCode') {
    const inlineCode = node as mdast.InlineCode;
    return x('code', {}, inlineCode.value);
  } else if (node.type == 'break') {
    return x('br', {}, []);
  } else if (node.type == 'link') {
    const link = node as mdast.Link;
    const attributes: Record<string, string | undefined> = {};

    if (link.url != undefined) {
      attributes['href'] = link.url;
    }

    if (link.title != undefined) {
      attributes['title'] = link.title;
    }

    const children = transformChildren(link);
    return x('a', attributes, children);
  } else if (node.type == 'image') {
    const image = node as mdast.Image;
    const attributes: Record<string, string | undefined> = {};

    attributes['src'] = image.url;

    if (image.alt != undefined) {
      attributes['alt'] = image.alt;
    }

    if (image.title != undefined) {
      attributes['title'] = image.title;
    }

    return x('img', attributes, []);
    // } else if (node.type == 'linkReference') {
    // } else if (node.type == 'imageReference') {
  } else if (node.type == 'math') {
    const math = node as mdastMath.Math;
    return x('math', {}, [math.value]);
  } else if (node.type == 'inlineMath') {
    const inlineMath = node as mdastMath.InlineMath;
    return x('math', {}, [inlineMath.value]);
  }

  throw new Error(`Type ${node.type} is not supported`);
}