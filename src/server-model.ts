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
    this.sitemap = new Sitemap('https://koyomiji.com/');
  }

  getEntry(pathname: string) {
    const entry = this.entries[pathname];

    if (entry == undefined || entry.content == null) {
      throw new Error(`Not found: ${pathname}`);
    }

    return KTML.transformPaths(entry);
  }

  resolvePath(pathname: string) {
    return path.join(this.rootDir, pathname);
  }

  trimFilename(pathname: string) {
    return toPathname(pathname.split('/').slice(0, -1));
  }

  async loadEntry(pathname: string) {
    let normalized = this.trimFilename(pathname);
    let logicalPath = normalized;

    if (normalized.startsWith('/reference/')) {
      const spliced = normalized.split('/');
      normalized = `/reference/${spliced.at(-1)}`;
    }

    const content = await this.readFile(pathname);
    this.entries[normalized] = KTML.createDocument(normalized, content, logicalPath);
    return normalized;
  }

  async loadDictionary(pathname: string) {
    const normalized = this.trimFilename(pathname);
    const content = await this.readFile(pathname);
    this.dictionaries[normalized] = KDML.createDocument(normalized, content);
    return normalized;
  }

  async readFile(pathname: string) {
    return await readFileUTF8(this.resolvePath(pathname));
  }

  async writeFile(pathname: string, content: string) {
    await fs.writeFile(this.resolvePath(pathname), content);
  }

  async compileEntry(pathname: string) {
    if (pathname.endsWith('.md')) {
      const normalized = this.trimFilename(pathname);
      const xmlPath = path.join(normalized, 'index.ktml');
      const file = await this.readFile(pathname);
      let xmlContent: string;

      try {
        xmlContent = markdown.toKTML(file);
      } catch (error) {
        console.error(error);
        return;
      }

      await this.writeFile(xmlPath, xmlContent);
      await this.loadEntry(xmlPath);
    } else if (pathname.endsWith('.himd')) {
      const normalized = this.trimFilename(pathname);
      const xmlPath = path.join(normalized, 'index.ktml');
      const file = await this.readFile(pathname);
      let xmlContent: string;

      try {
        xmlContent = markdown.toKTML(himd.toMarkdown(file));
      } catch (error) {
        console.error(error);
        return;
      }
      
      await this.writeFile(xmlPath, xmlContent);
      await this.loadEntry(xmlPath);
    }
  }
}