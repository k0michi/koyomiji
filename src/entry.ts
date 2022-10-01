export interface Entry {
  title: string;
  id: string;
  created: string;
  modified: string;
  description: string;
  source?: string;
  path: string[];
  content?: string;
}

export interface Dictionary {
  title: string;
  created: string;
  description: string;
  path: string[];
  content?: DictionaryEntry[];
}

export interface DictionaryEntry {
  word: string;
  senses: DictionarySense[];
  number: number;
}

export interface DictionarySense {
  pos?: string;
  usage?: string;
  gloss: string;
}

export function mapEntries(entries: Entry[]) {
  entries.sort((a, b) => {
    if (a.path[1] == b.path[1]) {
      return a.path[2].localeCompare(b.path[2]);
    } else {
      return a.path[1].localeCompare(b.path[1]);
    }
  });

  const map: Record<string, Entry[]> = {};

  for (const item of entries) {
    if (map[item.path[1]] == null) {
      map[item.path[1]] = [];
    }

    map[item.path[1]].push(item);
  }

  return map;
}