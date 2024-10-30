import window from '@k0michi/isomorphic-dom';
import Path from 'node:path';
import { Entry } from '../lib/entry';
import { getTextContent, parseXML } from '../lib/xml';
import Crypto from 'node:crypto';
import FS from 'node:fs';
import FSPromise from 'node:fs/promises';
import FSHelper from './FSHelper';
import { ServerModel } from './server-model';
import PathHelper from './PathHelper';

function getDescription(node: Node, limit: number) {
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

function isContainerBlock(tagName: string) {
  return tagName == 'body' || tagName == 'li';
}

export default class KTMLLoader {
  server: ServerModel;

  constructor(server: ServerModel) {
    this.server = server;
  }

  resolveInternal(internalPath: string) {
    return Path.join(this.server.rootDir, internalPath);
  }

  async load(internalPath: string) {
    internalPath = PathHelper.prefixWithSlash(internalPath);

    const context = {
      internalPath,
      attachments: []
    } satisfies KTMLLoaderContext;

    const content = await FSPromise.readFile(this.resolveInternal(internalPath), 'utf-8');
    const $document = parseXML(content);
    const $head = $document.querySelector('head') as Element;
    const title = getTextContent('title', $head)!;
    const id = getTextContent('id', $head)!;
    const created = getTextContent('created', $head)!;
    const modified = getTextContent('modified', $head) ?? created;
    let source = getTextContent('source', $head);

    if (source != undefined) {
      source = (await this.loadAttachment(source, context)).path;
    }

    const $body = $document.querySelector('body')!;
    this.transformMath($body);
    this.transformCode($body);
    await this.transformImg($body, context);
    const description = getDescription($body, 120);
    const path = await this.server.mapInternalPath(internalPath);
    const entry = {
      title,
      id,
      created,
      modified,
      description,
      path,
      source,
      content: $body.outerHTML,
    };

    return {
      entry,
      attachments: context.attachments,
      internalPath,
      path
    }
  }

  transformMath(element: Element) {
    for (const math of element.querySelectorAll('math')) {
      const parentTag = (math.parentNode as Element).tagName;

      if (isContainerBlock(parentTag)) {
        math.setAttribute('display', 'block');
      } else {
        math.setAttribute('display', 'inline');
      }
    }
  }

  transformCode(element: Element) {
    for (const code of element.querySelectorAll('code')) {
      const parentTag = (code.parentNode as Element).tagName;

      if (isContainerBlock(parentTag)) {
        code.setAttribute('display', 'block');
      } else {
        code.setAttribute('display', 'inline');
      }
    }
  }

  async loadAttachment(relativePath: string, context: KTMLLoaderContext): Promise<KTMLAttachment> {
    const internalPath = Path.join(PathHelper.pop(context.internalPath), relativePath);
    const externalPath = await this.server.mapInternalPath(internalPath);
    const attachment = {
      internalPath,
      path: externalPath
    };
    context.attachments.push(attachment);
    return attachment;
  }

  async transformImg(element: Element, context: KTMLLoaderContext) {
    for (const img of element.querySelectorAll('img')) {
      const relativeSrc = img.getAttribute('src');

      if (relativeSrc != null) {
        img.setAttribute('src', (await this.loadAttachment(relativeSrc, context)).path);
      }
    }
  }
}

interface KTMLLoaderContext {
  internalPath: string;
  attachments: KTMLAttachment[];
}

export interface KTMLAttachment {
  internalPath: string;
  path: string;
}

export interface KTMLLoaderResult {
  entry: Entry;
  attachments: KTMLAttachment[];
  internalPath: string;
  path: string;
}