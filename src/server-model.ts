import path from "path";
import { Entry } from "./entry.js";
import { preprocess } from "./ktml.js";
import { readFileUTF8, toPathname } from "./utils.js";

export class ServerModel {
  rootDir: string;
  entries: Record<string, Entry>;
  dictionaries: Record<string, Entry>;

  constructor(rootDir: string) {
    this.rootDir = rootDir;
    this.entries = {};
    this.dictionaries = {};
  }

  getEntry(pathname: string) {
    const entry = this.entries[pathname];

    if (entry == undefined || entry.content == null) {
      throw new Error(`Not found: ${pathname}`);
    }

    return entry;
  }

  async loadEntry(pathname: string) {
    const normalized = toPathname(pathname.split('/').slice(0, -1));
    this.entries[normalized] = await this.readEntry(pathname);
  }

  async readEntry(p: string) {
    const entryPath = p.split('/').slice(0, -1);
    const content = await readFileUTF8(path.join(this.rootDir, p));
    console.log(entryPath);
    return preprocess(entryPath, content);
  }

  async addDictionary(pathname: string) {
    //
  }
}