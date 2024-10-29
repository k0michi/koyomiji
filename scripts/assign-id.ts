import * as path from "path";
import * as fs from "fs/promises";
import window from "@k0michi/isomorphic-dom";
import { glob } from "glob";
import crypto from "crypto";

import { readFileUTF8 } from '../lib/utils.js';
import { getElemAfter, getIndent } from "./utils.js";

function assignID($document: Document) {
  const $head = $document.querySelector('head')!;
  let $id = $head.querySelector('id');
  let $after: ChildNode | null = $head.querySelector('title')?.nextSibling ?? null;

  if ($id == null) {
    const indent = getIndent($head) ?? '';
    $id = $document.createElement('id');
    $head.insertBefore($document.createTextNode(indent), $after);
    $head.insertBefore($id, $after);
  }

  $id.textContent = crypto.randomUUID();
}

(async () => {
  const filenames = await glob('contents/**/*.ktml');
  const parser = new window.DOMParser();
  const serializer = new window.XMLSerializer();

  for (const filename of filenames) {
    const content = await readFileUTF8(filename);
    const $document = parser.parseFromString(content, 'text/xml');
    assignID($document);
    const modifiedContent = serializer.serializeToString($document);
    await fs.writeFile(filename, modifiedContent);
  }
})();