import * as path from "path";
import * as fs from "fs/promises";
import * as crypto from "crypto";

function simpleUUID() {
  return crypto.randomUUID().replace(/-/g, "");
}

(async () => {
  let pathToCreate = path.join(process.argv[2], simpleUUID());

  await fs.mkdir(pathToCreate, { recursive: true });
  pathToCreate = path.join(pathToCreate, 'index.md');

  try {
    await fs.stat(pathToCreate);
  } catch (e) {
    await fs.writeFile(pathToCreate, '');
  }
})();