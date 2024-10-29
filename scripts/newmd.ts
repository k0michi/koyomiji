import * as path from "path";
import * as fs from "fs/promises";

(async () => {
  let pathToCreate = process.argv[2];

  await fs.mkdir(pathToCreate, { recursive: true });
  pathToCreate = path.join(pathToCreate, 'index.md');

  try {
    await fs.stat(pathToCreate);
  } catch (e) {
    await fs.writeFile(pathToCreate, '');
  }
})();