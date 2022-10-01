import path from "path";
import { Dictionary, Entry } from "./entry.js";
import { preprocess } from "./ktml.js";
import * as KDML from "./kdml.js";
import { readFileUTF8, toPathname } from "./utils.js";
import Sitemap from "./sitemap.js";

export class ServerModel {
  rootDir: string;
  entries: Record<string, Entry>;
  dictionaries: Record<string, Dictionary>;

  sitemap: Sitemap;

  constructor(rootDir: string) {
    this.rootDir = rootDir;
    this.entries = {};
    this.dictionaries = {};
    this.sitemap = new Sitemap();
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
    const content = await readFileUTF8(path.join(this.rootDir, pathname));
    this.entries[normalized] =  preprocess(pathname.split('/').slice(0, -1), content);
  }

  async loadDictionary(pathname: string) {
    const normalized = toPathname(pathname.split('/').slice(0, -1));
    const content = await readFileUTF8(path.join(this.rootDir, pathname));
    this.dictionaries[normalized] = KDML.preprocess(pathname.split('/').slice(0, -1), content);
  }
}