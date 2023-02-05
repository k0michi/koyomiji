import * as path from "path";
import * as fs from "fs/promises";
import window from "@k0michi/isomorphic-dom";
import glob from "glob-promise";
import crypto from "crypto";

import { readFileUTF8 } from '../utils.js';
import { getElemAfter, getIndent, moveChildren } from "./utils.js";

export function isContainerBlock(tagName: string) {
  return tagName == 'body';
}

function changeElementName($document: Document) {
  const $body = $document.querySelector('body')!;

  for (const $codeElem of $body.querySelectorAll('code')) {
    const block = isContainerBlock(($codeElem.parentNode as Element).tagName);

    if (!block) {
      const $inline = $document.createElement('inline-code');
      moveChildren($codeElem, $inline);
      $codeElem.parentNode?.replaceChild($inline, $codeElem);
    }
  }

  for (const $mathElem of $body.querySelectorAll('math')) {
    const block = isContainerBlock(($mathElem.parentNode as Element).tagName);

    if (!block) {
      const $inline = $document.createElement('inline-math');
      moveChildren($mathElem, $inline);
      $mathElem.parentNode?.replaceChild($inline, $mathElem);
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

(async () => {
  const filenames = await glob('contents/**/*.ktml');
  const parser = new window.DOMParser();
  const serializer = new window.XMLSerializer();
  
  for (const filename of filenames) {
    const content = await readFileUTF8(filename);
    const $document = parser.parseFromString(content, 'text/xml');
    changeElementName($document);
    appendModified($document);

    const modifiedContent = serializer.serializeToString($document);
    await fs.writeFile(filename, modifiedContent);
  }
})();