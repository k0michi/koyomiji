import { Observable } from "kyoka";
import { Entry } from "./entry.js";

export interface InitialData {
  entries: Entry[];
}

export class Model {
  entries: Observable<Entry[]>;

  constructor(data: InitialData) {
    this.entries = new Observable(data.entries);
  }
}