import * as path from "path";
import * as fs from "fs/promises";
import crypto from "crypto";
import { toISOStringJST } from "../lib/date-format.js";

(async () => {
  let pathToCreate = process.argv[2];

  await fs.mkdir(pathToCreate, { recursive: true });
  pathToCreate = path.join(pathToCreate, 'index.ktml');
  const now = new Date();

  try {
    await fs.stat(pathToCreate);
  } catch (e) {
    await fs.writeFile(pathToCreate, blankPage(now));
  }
})();

function blankPage(date: Date) {
  const id = crypto.randomUUID();

  return `<ktml version="0.1">

<head>
  <title>Untitled</title>
  <id>${id}</id>
  <created>${toISOStringJST(date)}</created>
</head>

<body>
</body>

</ktml>`;
}