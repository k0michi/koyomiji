import * as path from "path";
import * as fs from "fs/promises";
import { JSDOM } from "jsdom";

import { walk, readText } from './utils.js';
import { formatDate } from "./new.js";

const jsdom = new JSDOM();
const { Node } = jsdom.window;

(async () => {
  let pathToTouch = process.argv[2];
  pathToTouch = path.join(pathToTouch, 'index.html');

  const parser = new jsdom.window.DOMParser();
  const content = await readText(pathToTouch);
  const $document = parser.parseFromString(content, 'text/xml');

  const $head = $document.querySelector('head')!;
  let $modified = $head.querySelector('modified');

  if ($modified == null) {
    const $created = $head!.querySelector('created')!;
    let indent = '';

    if ($created.previousSibling?.nodeType == Node.TEXT_NODE) {
      const data = ($created.previousSibling as Text).data;

      if (data.trim() == '') {
        indent = data;
      }
    }

    if ($head.lastChild?.nodeType == Node.TEXT_NODE) {
      const data = ($head.lastChild as Text).data;

      if (data == '\n') {
        $head.removeChild($head.lastChild);
      }
    }

    $modified = $document.createElement('modified');
    $head.append(indent);
    $head.append($modified);
    $head.append('\n');
  }

  const now = new Date();
  $modified.textContent = formatDate(now);
  const serializer = new jsdom.window.XMLSerializer();
  const modifiedContent = serializer.serializeToString($document);
  await fs.writeFile(pathToTouch, modifiedContent);
})();