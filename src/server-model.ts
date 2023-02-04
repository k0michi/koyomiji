import path from "path";
import { DictionaryDocument, ArticleDocument } from "./document.js";
import * as KTML from "./format/ktml.js";
import * as KDML from "./format/kdml.js";
import { readFileUTF8, toPathname } from "./utils.js";
import Sitemap from "./sitemap.js";
import * as fs from "fs/promises";
import * as markdown from "./format/markdown.js";
import * as himd from './format/himd.js';

export class ServerModel {
  rootDir: string;
  entries: Record<string, ArticleDocument>;
  dictionaries: Record<string, DictionaryDocument>;

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

    return KTML.transformPaths(entry);
  }

  async loadEntry(pathname: string) {
    const normalized = toPathname(pathname.split('/').slice(0, -1));
    const content = await readFileUTF8(path.join(this.rootDir, pathname));
    this.entries[normalized] = KTML.createDocument(normalized, content);
  }

  async loadDictionary(pathname: string) {
    const normalized = toPathname(pathname.split('/').slice(0, -1));
    const content = await readFileUTF8(path.join(this.rootDir, pathname));
    this.dictionaries[normalized] = KDML.createDocument(normalized, content);
  }

  async compileEntry(pathname: string) {
    if (pathname.endsWith('.md')) {
      const normalized = toPathname(pathname.split('/').slice(0, -1));
      const file = await readFileUTF8(path.posix.join(this.rootDir, pathname));
      const xmlContent = markdown.toKTML(file);
      const dest = path.join(this.rootDir, normalized, 'index.ktml');
      await fs.writeFile(dest, xmlContent);
      await this.loadEntry(path.join(normalized, 'index.ktml'));
    } else if (pathname.endsWith('.himd')) {
      const normalized = toPathname(pathname.split('/').slice(0, -1));
      const file = await readFileUTF8(path.posix.join(this.rootDir, pathname));

      /*
      const xmlContent = toKTML(file);
      const dest = path.join(this.rootDir, normalized, 'index.ktml');
      await fs.writeFile(dest, xmlContent);
      await this.loadEntry(path.join(normalized, 'index.ktml'));*/
    }
  }
}