import * as hipt from 'hipt';

import * as markdown from './markdown.js';
import { toXml } from 'xast-util-to-xml';

export function toXML(source: string) {
  const flattened = toMarkdown(source);
  const xml = toXml(markdown.parseToXast(flattened) as any, { allowDangerousXml: true });
  return xml;
}

export function toMarkdown(source: string) {
  const tree = hipt.parse(source, { deepenIf: value => value.startsWith('#') });

  if (tree.children.length != 1) {
    throw new Error('Tree must have only one child');
  }

  const flattened = flatten(tree.children[0]);
  return flattened;
}

function flatten(node: hipt.Node): string {
  let content = node.value! + '\n';

  for (const c of node.children) {
    if (c.value!.startsWith('#')) {
      c.value = '#' + c.value!
      content += '<section>\n\n';
      content += flatten(c);
      content += '\n</section>\n';
    } else {
      content += c.value! + '\n';
    }
  }

  return content;
}