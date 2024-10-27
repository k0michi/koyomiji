import window from '@k0michi/isomorphic-dom';
import { newElementCreator } from './xml.js';

export interface MapURL {
  loc: string;
  lastMod?: string;
  changeFreq?: string;
  priority?: string;
}

export default class Sitemap {
  map: Record<string, MapURL>;

  constructor() {
    this.map = {};
  }

  add(loc: string, lastMod?: string) {
    loc = new URL(loc, 'https://koyomiji.com/').toString();
    this.map[loc] = { loc, lastMod };
  }

  toXML(): string {
    const ns = 'http://www.sitemaps.org/schemas/sitemap/0.9';
    const document = window.document.implementation.createDocument(ns, 'urlset');
    const create = newElementCreator(document, ns);
    const urlset = document.firstChild! as Element;

    for (const u of Object.values(this.map)) {
      const url = create('url');
      url.appendChild(create('loc', {}, u.loc));

      if (u.lastMod != null) {
        url.appendChild(create('lastmod', {}, u.lastMod));
      }

      if (u.changeFreq != null) {
        url.appendChild(create('changefreq', {}, u.changeFreq));
      }

      if (u.priority != null) {
        url.appendChild(create('priority', {}, u.priority));
      }

      urlset.appendChild(url);
    }

    const serializer = new window.XMLSerializer();
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + serializer.serializeToString(urlset);
  }
}