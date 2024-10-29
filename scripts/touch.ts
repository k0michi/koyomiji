import * as path from "path";
import * as fs from "fs/promises";
import window from "@k0michi/isomorphic-dom";

import { readFileUTF8 } from '../lib/utils.js';
import { getElemAfter, getIndent } from "./utils.js";
import { toISOStringJST } from "../lib/date-format.js";

function editModified($document: Document) {
  const $head = $document.querySelector('head')!;
  let $modified = $head.querySelector('modified');
  let $after: ChildNode | null = getElemAfter($head);

  if ($modified == null) {
    const indent = getIndent($head) ?? '';
    $modified = $document.createElement('modified');
    $head.insertBefore($document.createTextNode(indent), $after);
    $head.insertBefore($modified, $after);
  }

  const now = new Date();
  $modified.textContent = toISOStringJST(now);
}

(async () => {
  let pathToTouch = process.argv[2];
  pathToTouch = path.join(pathToTouch, 'index.ktml');

  const parser = new window.DOMParser();
  const content = await readFileUTF8(pathToTouch);
  const $document = parser.parseFromString(content, 'text/xml');
  editModified($document);
  const serializer = new window.XMLSerializer();
  const modifiedContent = serializer.serializeToString($document);
  await fs.writeFile(pathToTouch, modifiedContent);
})();