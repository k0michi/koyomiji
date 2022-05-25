import * as path from "path";
import * as fs from "fs/promises";
import dateFormat, { masks } from "dateformat";

(async () => {
  let pathToCreate = process.argv[2];

  await fs.mkdir(pathToCreate, { recursive: true });
  pathToCreate = path.join(pathToCreate, 'index.html');
  const now = new Date();
  await fs.writeFile(pathToCreate, blankPage(now));
})();

function blankPage(date: Date) {
  return `<html>

<head>
  <title>Untitled</title>
  <created>${dateFormat(date, "yyyy-mm-dd'T'HH:MM:ssp")}</created>
</head>

<body>
</body>

</html>`;
}