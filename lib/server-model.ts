import path from "path";
import { Dictionary, Entry } from "./entry.js";
import { preprocess } from "./ktml.js";
import * as KDML from "./kdml.js";
import { readFileUTF8, toPathname } from "./utils.js";
import Sitemap from "./sitemap.js";
import * as fs from "fs/promises";
import { toKTML } from "./markdown.js";
import { glob } from "glob";
import { newElementCreator } from "./xml.js";
import { toISOStringJST } from "./date-format.js";
import window from '@k0michi/isomorphic-dom';

export class ServerModel {
  rootDir: string;
  entries: Record<string, Entry>;
  dictionaries: Record<string, Dictionary>;
  sitemap: Sitemap;
  readAll: boolean = false;

  static _instance: ServerModel | null = null;

  static get instance(): ServerModel {
    if (!ServerModel._instance) {
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

  async getEntry(pathname: string) {
    const entry = this.entries[pathname];

    if (entry == undefined) {
      await this.loadEntry(pathname + '/index.ktml');
    }

    return this.entries[pathname];
  }

  async getDictionary(pathname: string) {
    const entry = this.dictionaries[pathname];

    if (entry == undefined) {
      await this.loadDictionary(pathname + '/index.kdml');
    }

    return this.dictionaries[pathname];
  }

  async getEntryIndex() {
    if (!this.readAll) {
      await this._loadAllEntries();
    }

    const entries = structuredClone(this.entries);
    for (const e of Object.values(entries)) {
      delete e.content;
    }

    return entries;
  }

  async _loadAllEntries() {
    for (const p of await glob('**/*', { cwd: this.rootDir, nodir: true })) {
      if (p.endsWith('index.ktml')) {
        await this.loadEntry(p);
      } else if (p.endsWith('index.kdml')) {
        await this.loadDictionary(p);
      }
    }

    this.readAll = true;
  }

  async readFile(pathname: string) {
    return await fs.readFile(path.join(this.rootDir, pathname));
  }

  // getEntry(pathname: string) {
  //   const entry = this.entries[pathname];

  //   if (entry == undefined || entry.content == null) {
  //     throw new Error(`Not found: ${pathname}`);
  //   }

  //   return entry;
  // }

  // FIXME: Argument name. Here pathname is a real file path
  // FIXME: Insane path normalization
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

  async compileMarkdown(pathname: string) {
    const normalized = toPathname(pathname.split('/').slice(0, -1));
    const file = await readFileUTF8(path.posix.join(this.rootDir, pathname));
    const xmlContent = await toKTML(file);
    const dest = path.join(this.rootDir, normalized, 'index.ktml');
    await fs.writeFile(dest, xmlContent);
    await this.loadEntry(path.join(normalized, 'index.ktml'));
  }

  async getSitemapAsString() {
    if (!this.readAll) {
      await this._loadAllEntries();
    }

    return this.sitemap.toXML();
  }

  async getFeedAsString() {
    if (!this.readAll) {
      await this._loadAllEntries();
    }

    const atomNS = 'http://www.w3.org/2005/Atom';
    const document = window.document.implementation.createDocument(atomNS, 'feed');
    const create = newElementCreator(document, atomNS);
    const feed = document.firstChild! as Element;

    feed.appendChild(create('title', {}, '喫茶＊曆路'));
    feed.appendChild(create('id', {}, 'urn:uuid:7e260dae-5479-45c2-bad8-0be227c48ab8'));
    feed.appendChild(create('link', { rel: 'self', href: 'https://koyomiji.com/feed.xml' }));
    feed.appendChild(create('link', { rel: 'alternate', href: 'https://koyomiji.com/' }));
    feed.appendChild(create('updated', {}, toISOStringJST(new Date())));
    feed.appendChild(create('icon', {}, 'https://koyomiji.com/favicon.ico'));

    const author = create('author');
    author.appendChild(create('name', {}, 'Komichi'));
    author.appendChild(create('email', {}, 'k0michi@koyomi.co'));
    feed.appendChild(author);

    for (const e of Object.values(this.entries)) {
      const entry = create('entry');
      entry.appendChild(create('title', {}, e.title));
      entry.appendChild(create('summary', {}, e.description));
      entry.appendChild(create('id', {}, `urn:uuid:${e.id}`));
      entry.appendChild(create('link', { rel: 'alternate', href: new URL(e.path, 'https://koyomiji.com/').toString() }));
      entry.appendChild(create('published', {}, e.created));
      entry.appendChild(create('updated', {}, e.modified));
      feed.appendChild(entry);
    }

    const serializer = new window.XMLSerializer();
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + serializer.serializeToString(feed);
  }
}