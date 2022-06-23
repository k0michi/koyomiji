import * as path from "path";
import * as fs from "fs/promises";
import dateFormat, { masks } from "dateformat";

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
  return `<ktml version="0.1">

<head>
  <title>Untitled</title>
  <created>${formatDate(date)}</created>
</head>

<body>
</body>

</ktml>`;
}

export function formatDate(date: Date) {
  return dateFormat(date, "yyyy-mm-dd'T'HH:MM:ssp");
}