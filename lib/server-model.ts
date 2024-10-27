import path from "path";
import { Dictionary, Entry } from "./entry.js";
import { preprocess } from "./ktml.js";
import * as KDML from "./kdml.js";
import { readFileUTF8, toPathname } from "./utils.js";
import Sitemap from "./sitemap.js";
import * as fs from "fs/promises";
import { toKTML } from "./markdown.js";

export class ServerModel {
  rootDir: string;
  entries: Record<string, Entry>;
  dictionaries: Record<string, Dictionary>;
  sitemap: Sitemap;

  static _instance: ServerModel | null = null;

  static get instance() {
    if (ServerModel._instance) {
      throw new Error('ServerModel not created');
    }

    return ServerModel._instance;
  }

  constructor(rootDir: string) {
    this.rootDir = rootDir;
    this.entries = {};
    this.dictionaries = {};
    this.sitemap = new Sitemap();
    ServerModel._instance = this;
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
    this.entries[normalized] = preprocess(normalized, content);
  }

  async loadDictionary(pathname: string) {
    const normalized = toPathname(pathname.split('/').slice(0, -1));
    const content = await readFileUTF8(path.join(this.rootDir, pathname));
    this.dictionaries[normalized] = KDML.preprocess(normalized, content);
  }

  async compileEntry(pathname: string) {
    const normalized = toPathname(pathname.split('/').slice(0, -1));
    const file = await readFileUTF8(path.posix.join(this.rootDir, pathname));
    const xmlContent = await toKTML(file);
    const dest = path.join(this.rootDir, normalized, 'index.ktml');
    await fs.writeFile(dest, xmlContent);
    await this.loadEntry(path.join(normalized, 'index.ktml'));
  }
}