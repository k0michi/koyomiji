import window from '@k0michi/isomorphic-dom';
import { newElementCreator } from './xml';
import URLHelper from './URLHelper';
import SiteConfig from './config';
import XMLDocumentSerializer from './visitor/XMLDocumentSerializer';

export interface SitemapItem {
  loc: string;
  lastMod?: string;
  changeFreq?: string;
  priority?: string;
}

export default class Sitemap {
  map: Record<string, SitemapItem>;

  constructor() {
    this.map = {};
  }

  add(loc: string, lastMod?: string) {
    loc = URLHelper.toString(loc, SiteConfig.getInfo().url);
    this.map[loc] = { loc, lastMod };
  }

  toXML(): string {
    const ns = 'http://www.sitemaps.org/schemas/sitemap/0.9';
    const serializer = new XMLDocumentSerializer();
    const urlset = serializer.visitElement(ns, 'urlset');

    for (const u of Object.values(this.map)) {
      const url = urlset?.visitElement(ns, 'url');

      {
        const loc = url?.visitElement(ns, 'loc');
        loc?.visitTextNode(u.loc);
        loc?.visitEnd();
      }

      if (u.lastMod != null) {
        const lastmod = url?.visitElement(ns, 'lastmod');
        lastmod?.visitTextNode(u.lastMod);
        lastmod?.visitEnd();
      }

      if (u.changeFreq != null) {
        const changefreq = url?.visitElement(ns, 'changefreq');
        changefreq?.visitTextNode(u.changeFreq);
        changefreq?.visitEnd();
      }

      if (u.priority != null) {
        const priority = url?.visitElement(ns, 'priority');
        priority?.visitTextNode(u.priority);
        priority?.visitEnd();
      }

      url?.visitEnd()
    }

    urlset?.visitEnd();
    serializer.visitEnd();
    return serializer.toString();
  }
}