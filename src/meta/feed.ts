import window from '@k0michi/isomorphic-dom';
import { newElementCreator } from "../xml";

export interface Author {
  name: string;
  email: string;
}

export interface FeedConfig {
  title: string;
  id: string;
  linkSelf: string;
  linkAlternate: string;
  updated: string;
  icon: string;
  author: Author;
}

export interface Entry {
  title: string;
  summary: string;
  id: string;
  linkRelative: string;
  published: string;
  updated: string;
}

export class Feed {
  _entries: Entry[];
  _config: FeedConfig;

  constructor(config: FeedConfig) {
    this._entries = [];
    this._config = config;
  }

  addEntry(entry: Entry) {
    this._entries.push(entry);
  }

  addEntries(entries: Entry[]) {
    this._entries.push(...entries);
  }

  toAtom(): string {
    const atomNS = 'http://www.w3.org/2005/Atom';
    const document = window.document.implementation.createDocument(atomNS, 'feed');
    const create = newElementCreator(document, atomNS);
    const feed = document.firstChild! as Element;

    feed.appendChild(create('title', {}, this._config.title));
    feed.appendChild(create('id', {}, `urn:uuid:${this._config.id}`));
    feed.appendChild(create('link', { rel: 'self', href: this._config.linkSelf }));
    feed.appendChild(create('link', { rel: 'alternate', href: this._config.linkAlternate }));
    feed.appendChild(create('updated', {}, this._config.updated));
    feed.appendChild(create('icon', {}, this._config.icon));

    const author = create('author');
    author.appendChild(create('name', {}, this._config.author.name));
    author.appendChild(create('email', {}, this._config.author.email));
    feed.appendChild(author);

    for (const e of Object.values(this._entries)) {
      const entry = create('entry');
      entry.appendChild(create('title', {}, e.title));
      entry.appendChild(create('summary', {}, e.summary));
      entry.appendChild(create('id', {}, `urn:uuid:${e.id}`));
      entry.appendChild(create('link', { rel: 'alternate', href: new URL(e.linkRelative, this._config.linkAlternate).toString() }));
      entry.appendChild(create('published', {}, e.published));
      entry.appendChild(create('updated', {}, e.updated));
      feed.appendChild(entry);
    }

    const serializer = new window.XMLSerializer();
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + serializer.serializeToString(feed);
  }
}