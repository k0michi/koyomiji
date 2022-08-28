import { Observable } from "kyoka";
import { Entry } from "./entry.js";
import { compareArray } from "./utils.js";

export interface InitialData {
  entries: Entry[];
}

export class Model {
  entries: Observable<Entry[]>;

  constructor(data: InitialData) {
    this.entries = new Observable(data.entries);
  }

  getEntry(path: string[]) {
    const entries = this.entries.get();
    const index = entries.findIndex(p => compareArray(p.path, path));

    if (entries[index]?.content != null) {
      return entries[index];
    }

    throw fetch('/' + path.join('/') + '/entry.json').then(e => e.json()).then(e => {
      if (index != -1) {
        this.entries.get()[index] = e;
      } else {
        this.entries.get().push(e);
      }

      this.entries.set(this.entries.get());
    });
  }
}