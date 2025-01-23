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
      url?.visitElement(ns, 'loc')?.visitTextNode(u.loc);

      if (u.lastMod != null) {
        url?.visitElement(ns, 'lastmod')?.visitTextNode(u.lastMod);
      }

      if (u.changeFreq != null) {
        url?.visitElement(ns, 'changefreq')?.visitTextNode(u.changeFreq);
      }

      if (u.priority != null) {
        url?.visitElement(ns, 'priority')?.visitTextNode(u.priority);
      }
    }

    return serializer.toString();
  }
}