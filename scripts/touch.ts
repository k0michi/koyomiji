import * as path from "path";
import * as fs from "fs/promises";
import window from "@k0michi/isomorphic-dom";

import { getElemAfter, getIndent } from "./utils";
import { toISOStringJST } from "../lib/DateFormat.index";
import FSHelper from "lib/FSHelper";

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

function blankPage(date: Date) {
  const id = crypto.randomUUID();

  return `<?xml version="1.0" encoding="UTF-8"?>
<ktml version="0.1">

<head>
  <title>Untitled</title>
  <id>${id}</id>
  <created>${toISOStringJST(date)}</created>
  <modified>${toISOStringJST(date)}</modified>
</head>

<body>
</body>

</ktml>`;
}

(async () => {
  let pathsToTouch = process.argv.slice(2);

  for (let pathToTouch of pathsToTouch) {
    await fs.mkdir(pathToTouch, { recursive: true });
    pathToTouch = path.join(pathToTouch, 'index.ktml');

    const parser = new window.DOMParser();

    try {
      const content = await FSHelper.readFileUTF8(pathToTouch);
      const $document = parser.parseFromString(content, 'text/xml');
      editModified($document);
      const serializer = new window.XMLSerializer();
      const modifiedContent = serializer.serializeToString($document);
      await fs.writeFile(pathToTouch, modifiedContent);
    } catch (e) {
      await fs.writeFile(pathToTouch, blankPage(new Date()));
    }
  }
})();