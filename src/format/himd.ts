import * as himd from 'himd';

import * as markdown from './markdown.js';
import { toXml } from 'xast-util-to-xml';

export function toXML(source: string) {
  const flattened = toMarkdown(source);
  const xml = toXml(markdown.parseToXast(flattened) as any, { allowDangerousXml: true });
  return xml;
}

export function toMarkdown(source: string) {
  return himd.compile(source);
}