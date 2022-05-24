import * as fs from 'fs/promises';
import * as path from 'path';

export async function* walk(dirPath:string):AsyncIterable<string> {
  const dir = await fs.opendir(dirPath);

  for await (const dirent of dir) {
    const pathToEnt = path.join(dirPath, dirent.name);

    if (dirent.isFile()) {
      yield pathToEnt;
    } else if (dirent.isDirectory()) {
      for await (const e of walk(pathToEnt)) {
        yield e;
      }
    }
  }
}