import path from "path";
import { Dictionary, Entry } from "./entry";
import { toPathname } from "./utils";
import Sitemap from "./Sitemap";
import * as fs from "fs/promises";
import { toKTML } from "./markdown";
import { glob } from "glob";
import { newElementCreator } from "./xml";
import { toISOStringJST } from "./date-format";
import window from '@k0michi/isomorphic-dom';
import FSHelper from "./FSHelper";
import PathMapper from "./PathMapper";
import KTMLLoader, { KTMLAttachment } from "./KTMLLoader";
import { assert } from "console";
import SiteConfig from "./config";
import URLHelper from "./URLHelper";

export class ServerModel {
  rootDir: string;
  entries: Record<string, Entry>;
  dictionaries: Record<string, Dictionary>;
  attachments: Record<string, KTMLAttachment>;
  sitemap: Sitemap;
  readAll: boolean = false;
  pathMapper: PathMapper;
  ktmlLoader: KTMLLoader;

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
    this.attachments = {};
    this.sitemap = new Sitemap();
    this.pathMapper = new PathMapper(this);
    this.ktmlLoader = new KTMLLoader(this);
  }

  async ensureAll() {
    if (!this.readAll) {
      await this._loadAllEntries();
    }
  }

  async getEntry(pathname: string) {
    await this.ensureAll();
    const entry = this.entries[pathname];

    if (entry == undefined) {
      await this.loadEntry(pathname + '/index.ktml');
    }

    return this.entries[pathname];
  }

  async getDictionary(pathname: string) {
    await this.ensureAll();
    const entry = this.dictionaries[pathname];

    if (entry == undefined) {
      await this.loadDictionary(pathname + '/index.kdml');
    }

    return this.dictionaries[pathname];
  }

  async getEntryIndex() {
    await this.ensureAll();

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

  async readFile(internalPath: string) {
    return await fs.readFile(path.join(this.rootDir, internalPath));
  }

  // FIXME: Remove this
  normalizePath(pathname: string) {
    return toPathname(pathname.split('/').slice(0, -1));
  }

  registerAttachment(attachment: KTMLAttachment) {
    this.attachments[attachment.path] = attachment;
  }

  async getAttachmentFromExternalPath(externalPath: string) {
    const a = this.attachments[externalPath];
    assert(a);
    return await this.readFile(a.internalPath);
  }

  async loadEntry(internalPath: string) {
    const loadResult = await this.ktmlLoader.load(internalPath);

    for (const a of loadResult.attachments) {
      this.registerAttachment(a);
    }

    this.entries[loadResult.path] = loadResult.entry;
    this.sitemap.add(loadResult.path, loadResult.entry.modified);
  }

  async loadDictionary(internalPath: string) {
    const loadResult = await this.ktmlLoader.loadKDML(internalPath);

    this.dictionaries[loadResult.path] = loadResult.entry;
  }

  async compileMarkdown(pathname: string) {
    const normalized = this.normalizePath(pathname);
    const file = await FSHelper.readFileUTF8(path.posix.join(this.rootDir, pathname));
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

    feed.appendChild(create('title', {}, SiteConfig.getInfo().name));
    feed.appendChild(create('id', {}, `urn:uuid:${SiteConfig.getInfo().feedID}`));
    feed.appendChild(create('link', { rel: 'self', href: URLHelper.toString('/feed.xml', SiteConfig.getInfo().url) }));
    feed.appendChild(create('link', { rel: 'alternate', href: SiteConfig.getInfo().url }));
    feed.appendChild(create('updated', {}, toISOStringJST(new Date())));
    feed.appendChild(create('icon', {}, URLHelper.toString('/favicon.ico', SiteConfig.getInfo().url)));

    const author = create('author');
    author.appendChild(create('name', {}, SiteConfig.getInfo().authorName));
    author.appendChild(create('email', {}, SiteConfig.getInfo().email));
    feed.appendChild(author);

    for (const e of Object.values(this.entries)) {
      const entry = create('entry');
      entry.appendChild(create('title', {}, e.title));
      entry.appendChild(create('summary', {}, e.description));
      entry.appendChild(create('id', {}, `urn:uuid:${e.id}`));
      entry.appendChild(create('link', { rel: 'alternate', href: URLHelper.toString(e.path, SiteConfig.getInfo().url) }));
      entry.appendChild(create('published', {}, e.created));
      entry.appendChild(create('updated', {}, e.modified));
      feed.appendChild(entry);
    }

    const serializer = new window.XMLSerializer();
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + serializer.serializeToString(feed);
  }

  mapInternalPath(internalPath: string) {
    return this.pathMapper.mapInternal(internalPath);
  }

  async getDynamicPaths() {
    await this.ensureAll();
    return Object.keys(this.entries).concat(Object.keys(this.attachments));
  }
}