import * as path from "path";
import * as fs from "fs/promises";
import window from "@k0michi/isomorphic-dom";
import { glob } from 'glob';
import crypto from "crypto";
import Path from 'node:path';

import { getElemAfter, getIndent } from "./utils.js";
import DOMHelper from "lib/DOMHelper.js";
import FSHelper from "lib/FSHelper.js";
import PathHelper from "lib/PathHelper.js";

function isContainerBlock(tagName: string) {
  return tagName == 'body' || tagName == 'li' || tagName == 'blockquote';
}

function changeElementName($document: Document) {
  const $body = $document.querySelector('body')!;

  for (const $codeElem of $body.querySelectorAll('code')) {
    const block = isContainerBlock(($codeElem.parentNode as Element).tagName);
    const $cdata = $document.createCDATASection($codeElem.textContent ?? '');
    $codeElem.replaceChildren($cdata);

    if (block) {
      const $block = $document.createElement('blockcode');
      DOMHelper.moveChildren($codeElem, $block);
      DOMHelper.copyAttributes($codeElem, $block);
      $codeElem.parentNode?.replaceChild($block, $codeElem);
    }
  }

  for (const $mathElem of $body.querySelectorAll('math')) {
    const block = isContainerBlock(($mathElem.parentNode as Element).tagName);
    const $cdata = $document.createCDATASection($mathElem.textContent ?? '');
    $mathElem.replaceChildren($cdata);

    if (block) {
      const $block = $document.createElement('blockmath');
      DOMHelper.moveChildren($mathElem, $block);
      DOMHelper.copyAttributes($mathElem, $block);
      $mathElem.parentNode?.replaceChild($block, $mathElem);
    }
  }

  for (const $aElem of $body.querySelectorAll('a')) {
    const href = $aElem.getAttribute('href');

    if (href) {
      $aElem.setAttribute('ref', href);
      $aElem.removeAttribute('href');
    }
  }
}

function insertElement(parent: Element, before: string, element: Element) {
  const $document = parent.ownerDocument;
  const indent = getIndent(parent) ?? '';
  let $after: ChildNode | null = parent.querySelector(before)?.nextSibling ?? null;
  parent.insertBefore($document.createTextNode(indent), $after);
  parent.insertBefore(element, $after);
}

function appendModified($document: Document) {
  const $head = $document.querySelector('head')!;
  let $modified = $head.querySelector('modified');

  if ($modified == null) {
    $modified = $document.createElement('modified');
    let $created = $head.querySelector('created');
    $modified.textContent = $created?.textContent!;
    insertElement($head, 'created', $modified);
  }
}

function unwrapImages($document: Document) {
  const images = $document.querySelectorAll('p>img');

  for (const im of images) {
    if (!im.parentElement || im.parentElement.childNodes.length > 1) {
      continue;
    }

    im.parentElement.parentElement?.replaceChild(im, im.parentElement);
  }
}

(async () => {
  const filenames = await glob('contents/**/index.ktml');
  const parser = new window.DOMParser();
  const serializer = new window.XMLSerializer();

  for (const filename of filenames) {
    console.log(filename)
    const content = await FSHelper.readFileUTF8(filename);
    const $document = parser.parseFromString(content, 'text/xml');

    // const $kyml = $document.createElementNS('https://koyomiji.com/kyml', 'text');
    // DOMHelper.moveChildren($document.documentElement, $kyml);
    // $document.documentElement.remove();
    // $document.appendChild($kyml);

    changeElementName($document);
    appendModified($document);
    unwrapImages($document);

    let modifiedContent = '<?xml version="1.0" encoding="UTF-8"?>\n' + serializer.serializeToString($document);
    // 全て要素のnamespaceを変更するのが面倒なので
    // modifiedContent = modifiedContent.replaceAll(` xmlns=""`, '');
    // await fs.writeFile(Path.join(PathHelper.pop(filename), 'index.kyml'), modifiedContent);

    await fs.writeFile(Path.join(PathHelper.pop(filename), 'index.ktml'), modifiedContent);
  }
})();