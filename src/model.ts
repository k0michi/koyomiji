import { Observable } from "kyoka";
import { DictionaryDocument, ArticleDocument } from "./document.js";
import { toPathname } from "./utils.js";

export interface Data {
  entries: Record<string, ArticleDocument>;
  isIndexComplete: boolean;
}

export class Model {
  entries: Observable<Record<string, ArticleDocument>>;
  isIndexComplete: Observable<boolean>;
  dictionaries: Observable<Record<string, DictionaryDocument> | null>;
  assets: Observable<Record<string, any>>;

  constructor(data: Data) {
    this.entries = new Observable(data.entries);
    this.isIndexComplete = new Observable<boolean>(data.isIndexComplete);
    this.dictionaries = new Observable<Record<string, DictionaryDocument> | null>(null);
    this.assets = new Observable({});
  }

  getEntry(path: string[]) {
    const entries = this.entries.get();
    const pathname = toPathname(path);
    const entry = entries[pathname];

    if (entry?.content != null) {
      return entry;
    }

    return fetch('/' + path.join('/') + '/entry.json').then(e => e.json()).then(e => {
      entries[pathname] = e;
      this.entries.set(this.entries.get());
      return e as ArticleDocument;
    });
  }

  getIndex() {
    if (this.isIndexComplete.get()) {
      return this.entries.get();
    }

    return fetch('/entries.json').then(r => r.json()).then(e => {
      this.isIndexComplete.set(true);

      for (const [key, value] of Object.entries(e)) {
        const entries = this.entries.get();
        entries[key] = { ...entries[key], ...(value as any) };
      }

      this.entries.set(this.entries.get());
      return this.entries.get();
    });
  }

  fetchDictionary() {
    if (this.dictionaries.get() == null) {
      fetch('/dictionary/data.json').then(r => r.json()).then(e => {
        this.dictionaries.set(e);
      });
    }
  }
}