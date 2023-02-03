import * as hipt from 'hipt';

import * as markdown from './markdown.js';
import { toXml } from 'xast-util-to-xml';

const headingExp = /^#\s*(.*)$/;

interface Block {
  title: string;
  content: string;
  children: Block[];
}

export function parse(source: string) {
  const tree = hipt.parse(source);

  if (tree.children.length != 1) {
    throw new Error('Tree must have one child');
  }

  return processBlock(tree.children[0]);
}

function processBlock(node: hipt.Node): Block {
  const headingResult = headingExp.exec(node.value!);

  if (headingResult == null) {
    throw new Error('Must have heading');
  }

  const heading = headingResult[1];
  let content = '';
  const childBlocks = [];

  for (const c of node.children) {
    if (headingExp.test(c.value!)) {
      childBlocks.push(processBlock(c));
    } else {
      content += c.value! + '\n';
    }
  }

  const contentXML = toXml(markdown.parseToXast(content) as any, { allowDangerousXml: true });
  return { title: heading, content: contentXML, children: childBlocks };
}